import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { options } from "../utils/constant.js";
const registerUser = asyncHandler(async (req, res) => {
  try {
    // get user details from frontend

    const { username, email, password } = req.body;
    console.log(req.file);
    // validation - not empty

    if (
      [email, username, password].some((field) => {
        field?.trim() === "";
      })
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // check if user already exists: username, email

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    // check for images, check for avatar

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    // create user object - create entry in db

    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      profilePicture: avatar.url,
    });

    // remove password and refresh token field from response

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // check for user creation

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    // return res

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
const loginUser = asyncHandler(async (req, res) =>{
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, password} = req.body

  if (!email) {
      throw new ApiError(400, "username or email is required")
  }
  console.log(email)
  const user = await User.findOne({
      email
  })

  if (!user) {
      throw new ApiError(404, "User does not exist")
  }

//  const isPasswordValid = await user.isPasswordCorrect(password)

//  if (!isPasswordValid) {
//   throw new ApiError(401, "Invalid user credentials")
//   }

 const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true, // Make sure to set this in production with HTTPS
    sameSite: 'strict'
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken,options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

})


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user=req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select('-password -refreshToken');

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


const getUserById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findById(id).select('username email profilePicture profileName bio');

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    console.log(error.message); // Corrected typo 'messege' to 'message'
    res.status(500).json({ error: "Internal server error" });
  }
});



export {
  registerUser,
  loginUser,
  generateAccessAndRefreshTokens,
  logoutUser,
  getCurrentUser,
  changeCurrentPassword,
  getUserById,getAllUser,
};
