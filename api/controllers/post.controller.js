import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import Post from "../models/posts.model.js";

const uploadPosts = asyncHandler(async (req, res) => {
  try {
    const { content, tags } = req.body;
    if (!content) {
      throw new ApiError(400, "content is required");
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
    const userId = req.user._id;
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $unwind: {
          path: "$likes",
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likes.user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true, // Preserve likes with no user details
        },
      },
      {
        $group: {
          _id: "$_id",
          content: { $first: "$content" },
          post_image: { $first: "$post_image" },
          users: { $push: "$userDetails" },
          likeCount: { $sum: { $cond: [{ $ifNull: ["$likes", false] }, 1, 0] } },
        },
      },
      {
        $addFields: {
          liked: {
            $in: [userId, "$users._id"],
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          post_image: 1,
          users: 1,
          likeCount: 1,
          liked: 1,
        },
      },
    ]);

    res.status(200).json(
      new ApiResponse(200, posts, "Posts fetched successfully with user details")
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const getPostByUserId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Use Mongoose's find method to fetch posts by user ID
    const posts = await Post.find({ user: id }).populate(
      "user",
      "username profilePicture email"
    );

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

export { uploadPosts, getAllPosts, getPostByUserId };
