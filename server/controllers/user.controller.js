import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Fixed spelling
import { options } from "../utils/constant.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password ,profileName} = req.body;
  const avatarLocalPath = req.file?.path;

  try {
    if (!username || !email || !password || !avatarLocalPath) {
      throw new ApiError(400, "All fields and an avatar are required");
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw new ApiError(409, "User already exists");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const user = await User.create({
      username: username.toLowerCase(),
      profileName,
      email,
      password,
      profilePicture: avatar.url,
      provider:"devnet"
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
  }
});

// Generate Access and Refresh Tokens
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Failed to generate tokens");
  }
};

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Check if the user signed up via Google (no password)
    if (!user.password) {
      res.status(404).json(new ApiResponse(404, "googleissue" , "This account is registered using Google. Please sign in using Google"))
      throw new ApiError(400, "This account is registered using Google. Please sign in using Google.");
    }

    // Validate password (uncomment this if you have a password validation method)
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    // Generate tokens for the user
    const { accessToken, refreshToken } = await generateTokens(user._id);

    // Return response with tokens and user data
    res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { ...user.toObject(), password: undefined }, "Logged in successfully"));

  } catch (error) {
    // Catch and throw errors as an ApiError
    throw new ApiError(error.statusCode || 500, error.message || "Login failed");
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Logout failed");
  }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(new ApiResponse(200, user, "User data fetched successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Failed to fetch user data");
  }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

    user.password = newPassword;
    await user.save();
    res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Failed to change password");
  }
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Failed to fetch users");
  }
});

// Get User by ID
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username email profilePicture");
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Failed to fetch user");
  }
});

// Update User Details
const updateUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { profileName, bio, username } = req.body;
  let profilePictureUrl = req.user.profilePicture; // Default to current profile picture

  try {
    // Check if a new profile picture is uploaded
    if (req.file?.path) {
      const avatar = await uploadOnCloudinary(req.file.path);
      profilePictureUrl = avatar.url; // Update to the new avatar URL
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: username || req.user.username,
        profileName: profileName || req.user.profileName,
        bio: bio || req.user.bio,
        profilePicture: profilePictureUrl, // Use the final profile picture URL
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) throw new ApiError(404, "User not found");

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Failed to update user details");
  }
});

export {
  registerUser,
  loginUser,
  generateTokens,
  logoutUser,
  getCurrentUser,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserDetails,
};
