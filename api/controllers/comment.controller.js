import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllCommentsOfPost = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const objectId = new mongoose.Types.ObjectId(postId);

    const comments = await Comment.aggregate([
      { $match: { postId: objectId } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails"
      },
      {
        $group: {
          _id: "$postId",
          comments: {
            $push: {
              _id: "$_id",
              comment: "$comments",
              author: "$author",
              createdAt: "$createdAt",
              userPicture: "$userDetails.picture",
              userName: "$userDetails.name"
            }
          }
        }
      }
    ]);

    res.status(200).json(
      new ApiResponse(200, comments, "Comments fetched successfully with user details")
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { getAllCommentsOfPost };
