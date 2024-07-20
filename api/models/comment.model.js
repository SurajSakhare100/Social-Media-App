import mongoose, { Schema } from "mongoose";

const CommentSchema = Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    comments:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
