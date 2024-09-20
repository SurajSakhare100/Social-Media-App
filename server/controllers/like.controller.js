import Like from "../models/like.model.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller to handle post like functionality
const likePost = asyncHandler( async (req, res) => {
  try {
    // Check if user_id exists
    const {id}=req.user
    const { post_id } = req.body;
    const user_id=id;
    console.log({post_id,user_id})
    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ post: post_id, user: user_id });
    if (existingLike) return res.status(400).json({ message: "Already liked" });

    // Create a new like
    const like = new Like({ post: post_id, user: user_id });
    like.isliked=true;
    await like.save();

    res.status(200).json(new ApiResponse(200, 
      like,
     like.isliked
    , "Posts fetched successfully"));
  } catch (error) {
    console.error("Error liking post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
})

const unlikePost=asyncHandler(async(req,res)=>{
  try {
   // Check if user_id exists
   const {id}=req.user
   const { post_id } = req.body;
   const user_id=id;
   console.log({post_id,user_id})
    // Find and delete the like
    const like = await Like.findOneAndDelete({ post: post_id, user: user_id });
    if (!like) return res.status(400).json({ message: 'Like not found' });

    // Decrement the likes count in the post
    await Post.findByIdAndUpdate(post_id, { $inc: { likesCount: -1 } });

    res.status(200).json({ message: 'Post unliked' });
} catch (error) {
    res.status(500).json({ message: 'Server error' });
}
})
export { likePost ,unlikePost};
