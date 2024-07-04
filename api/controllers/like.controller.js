import Like from "../models/like.model.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to handle post like functionality
const likePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
      // Check if userId exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if postId exists
      const post = await Post.findById(post_id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      // Check if the user already liked the post
      const existingLike = await Like.findOne({ user: user_id, post: post_id });
      if (existingLike) {
        return res.status(400).json({ error: "User already liked this post" });
      }
  
      // Create a new like
      const newLike = new Like({
        user: user_id, post: post_id
      });
  
      const savedLike = await newLike.save();
      res.status(201).json(savedLike);
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
export {
    likePost
}