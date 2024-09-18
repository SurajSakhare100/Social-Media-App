import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatarLocalPath = req.file?.path;

    if (!username || !email || !password || !avatarLocalPath) {
      throw new ApiError(400, "All fields and an avatar are required");
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw new ApiError(409, "User already exists");

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      profilePicture: avatar.url,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Internal server error"));
  }
});

// Generate Access and Refresh Tokens
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh tokens");
  }
};

// Login User
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // const isPasswordValid = await user.isPasswordCorrect(password); // Uncomment after adding password validation
    // if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateTokens(user._id);

    res.status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" })
      .json(new ApiResponse(200, { ...user.toObject(), password: undefined }, "Logged in successfully"));
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Internal server error"));
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
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, "Failed to log out"));
  }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(new ApiResponse(200, user, "User data fetched successfully"));
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, "Failed to fetch user data"));
  }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); // Add your password validation logic

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

    user.password = newPassword;
    await user.save();
    res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, "Failed to change password"));
  }
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, "Failed to fetch users"));
  }
});

// Get User by ID
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username email profilePicture");
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, "Failed to fetch user"));
  }
});


// Update User Details
const updateUserDetails = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is available in req.user from authentication middleware
    const { profileName, bio, username } = req.body;
    let profilePictureUrl = req.user.profilePicture; // Retain existing profile picture
    // Check if a new profile picture is uploaded
    if (req.file?.path) {
      profilePictureUrl = await uploadOnCloudinary(req.file.path); // Upload new profile picture to Cloudinary
    }

    // Update user details in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: username || req.user.username, // Update name if provided, else retain the current one
        profileName: profileName || req.user.profileName, // Update profileName if provided
        bio: bio || req.user.bio, // Update bio if provided
        profilePicture: profilePictureUrl.url // Use the updated or existing profile picture URL
      },
      { new: true, runValidators: true } // Return updated document and run schema validation
    ).select("-password -refreshToken"); // Exclude sensitive fields like password and refreshToken
    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Internal server error"));
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
  updateUserDetails
};
