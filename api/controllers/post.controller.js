import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";

// Create Post
const uploadPosts = asyncHandler(async (req, res) => {
  try {
    const { content, tags } = req.body;
    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    const post_image = req.file?.path;
    if (!post_image) {
      throw new ApiError(400, "Post image file is required");
    }

    const post_image_on_cloudinary = await uploadOnCloudinary(post_image);
    if (!post_image_on_cloudinary) {
      throw new ApiError(400, "Failed to upload image");
    }

    const post = await Post.create({
      content,
      tags,
      post_image: post_image_on_cloudinary.url,
      user: req.user._id,
    });

    const createdPost = await Post.findById(post._id);
    if (!createdPost) {
      throw new ApiError(500, "Something went wrong while creating the post");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, post, "Post added successfully"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Read All Posts
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      {
        $unwind: {
          path: "$creatorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $group: {
          _id: "$_id",
          content: { $first: "$content" },
          post_image: { $first: "$post_image" },
          creatorDetails: { $first: "$creatorDetails" },
          likeCount: { $sum: { $cond: [{ $ifNull: ["$likes", false] }, 1, 0] } },
          liked: { $sum: { $cond: [{ $eq: ["$likes.user", userId] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          post_image: 1,
          creatorDetails: 1,
          likeCount: 1,
          liked: { $gt: ["$liked", 0] },
        },
      },
    ]);

    res.status(200).json(
      new ApiResponse(200, posts, "Posts fetched successfully with creator details")
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Read Posts by User ID
const getPostByUserId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ user: id });

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No posts found for this user"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts fetched successfully"));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Post
const updatePost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { content, tags } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to update this post");
    }

    post.content = content || post.content;
    post.tags = tags || post.tags;

    if (req.file) {
      const post_image = req.file.path;
      const post_image_on_cloudinary = await uploadOnCloudinary(post_image);
      if (!post_image_on_cloudinary) {
        throw new ApiError(400, "Failed to upload image");
      }
      post.post_image = post_image_on_cloudinary.url;
    }

    await post.save();

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post updated successfully"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Post
const deletePost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this post");
    }

    await post.remove();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export { uploadPosts, getAllPosts, getPostByUserId, updatePost, deletePost };
