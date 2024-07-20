import Comment from "../models/comment.model";
import { asyncHandler } from "../utils/asyncHandler";

const getAllCommentsOfPost=asyncHandler((async (req,res)=>{
    try {

        // get Post Id
        // group by Post Id and return it

        const {postId}=req.params.Id

        const comment=await Comment.aggregate([{
            $group:{
                _id:postId,
            }
        }])

        res.status(200).json(
            new ApiResponse(200, comment, "Comments fetched successfully with user details")
          );
        } catch (error) {
          console.error("Error fetching posts:", error);
          res.status(500).json({ error: "Internal server error" });
        }
}))

export default {getAllCommentsOfPost}