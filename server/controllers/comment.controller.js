import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all comments of a post
const getAllCommentsOfPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Validate postId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid Post ID"));
  }

  const objectId = new mongoose.Types.ObjectId(postId);
  const comments = await fetchCommentsWithUserDetails(objectId);

  res.status(200).json(
    new ApiResponse(200, comments, "Comments fetched successfully with user details")
  );
});

// Helper function to fetch comments with user details
const fetchCommentsWithUserDetails = async (postId) => {
  return await Comment.aggregate([
    { $match: { postId: postId } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $group: {
        _id: "$postId",
        comments: {
          $push: {
            _id: "$_id",
            comment: "$comment",
            author: "$author",
            createdAt: "$createdAt",
            userPicture: "$userDetails.profilePicture",
            userName: "$userDetails.name",
          },
        },
      },
    },
  ]);
};

// Create a comment
const createComment = asyncHandler(async (req, res) => {
  const { userComment } = req.body;
  const { postId } = req.params;
  const userId = req.user._id; // Assuming `req.user` is populated by authentication middleware

  // Validate input
  if (!userComment || !postId || !userId) {
    return res.status(400).json(new ApiResponse(400, null, "Missing required fields"));
  }

  // Validate postId and userId
  if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid postId or userId"));
  }

  // Create the comment
  const comment = await Comment.create({
    author: userId,
    postId,
    comment: userComment, // Ensure the field name matches the schema
  });

  res.status(201).json(new ApiResponse(201, comment, "Comment created successfully"));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userComment } = req.body;

  // Validate commentId
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid Comment ID"));
  }

  // Check if userComment is provided
  if (!userComment) {
    return res.status(400).json(new ApiResponse(400, null, "Comment content is required"));
  }

  // Find the comment by ID
  const comment = await Comment.findById(commentId);

  // Check if the comment exists
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, null, "Comment not found"));
  }

  // Update the comment's content
  comment.comment = userComment;

  // Save the updated comment
  const updatedComment = await comment.save();

  res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});



// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // Validate commentId
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid Comment ID"));
  }

  // Delete the comment
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  // Check if the comment exists
  if (!deletedComment) {
    return res.status(404).json(new ApiResponse(404, null, "Comment not found"));
  }

  res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { getAllCommentsOfPost, createComment, updateComment, deleteComment };
