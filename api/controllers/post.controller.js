import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import Post from "../models/posts.model.js";


const uploadPosts = asyncHandler(async (req, res) => {
    try {
      const { title, tags } = req.body;
      if (!title) {
        throw new ApiError(400, "Title is required");
      }
  
      const post_image = req.file?.path;
      if (!post_image) {
        throw new ApiError(400, "Post image file is required");
      }
  
      // Upload image to Cloudinary
      const post_image_on_cloudinary = await uploadOnCloudinary(post_image);
      if (!post_image_on_cloudinary) {
        throw new ApiError(400, "Failed to upload image");
      }
  
      // Create new post
      const post = await Post.create({
        title,
        tags,
        post_image: post_image_on_cloudinary.url,
      });
  
      const createdPost = await Post.findById(post._id);
      if (!createdPost) {
        throw new ApiError(500, "Something went wrong while creating the post");
      }
  
      return res
        .status(201)
        .json(new ApiResponse(200, post, "Post added successfully"));
    } catch (error) {
      console.error(error);
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find();
    return res
      .status(201)
      .json(new ApiResponse(200, posts, "Posts get successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export { uploadPosts, getAllPosts };
