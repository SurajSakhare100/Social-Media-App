import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    post_image: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
