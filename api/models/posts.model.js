import mongoose, { Schema } from "mongoose";


const PostSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post_image: {
      type: String,
      required: true,
    },
    tags:{
        type: String,
      }
    ,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



const Post = mongoose.model("Post", PostSchema);

export default Post;
