import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAllCommentsOfPost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid Post ID"));
    }

    const objectId = new mongoose.Types.ObjectId(postId);

    const comments = await fetchCommentsWithUserDetails(objectId);

    return res.status(200).json(
      new ApiResponse(200, comments, "Comments fetched successfully with user details")
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});


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


const updateComment=asyncHandler(async(req,res)=>{
  try {
    const commentId = req.params.postId;
    const comment=await Comment.findAndModify({_id:commentId,$set:{}})
    res.status(200).json(
      new ApiResponse(200, comment, "Comments fetched successfully with user details")
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})


const createComment = asyncHandler(async (req, res) => {
  try {
    const { userComment, postId, userId } = req.body;

    // Validate input
    if (!userComment || !postId || !userId) {
      return res.status(400).json(new ApiResponse(400, null, "Missing required fields"));
    }

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid postId or userId"));
    }

    const comment = await Comment.create({
      author: userId,
      postId,
      comment: userComment, // Ensure the field name matches the schema
    });

    res.status(201).json(new ApiResponse(201, comment, "Comment created successfully"));
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

export { getAllCommentsOfPost,updateComment,createComment };
