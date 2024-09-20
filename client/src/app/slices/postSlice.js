import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const posturl = "http://localhost:3000/api/v1/posts";
const likeurl = "http://localhost:3000/api/v1/like";
const commenturl = "http://localhost:3000/api/v1/comments";
const handleResponse = (res) => res.data.data;
const handleError = (err) => {
  console.log(err.message);
  return [];
};

// Axios instance for requests
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axiosInstance.get(posturl + '/getallposts');
  return handleResponse(response);
});

// Create a new post
export const createPost = createAsyncThunk('posts/createPost', async (newPostData) => {
  const response = await axiosInstance.post(posturl + '/createpost', newPostData);
  return response.data;
});

// Delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
  await axiosInstance.delete(posturl + `/deletepost/${postId}`);
  return postId;
});

// Edit a post
export const editPost = createAsyncThunk('posts/editPost', async ({ postId, content }) => {
  const response = await axiosInstance.put(posturl + `/editpost/${postId}`, { content });
  return response.data;
});

// Like a post
export const likePost = createAsyncThunk('posts/likePost', async (post_id) => {
  const response = await axiosInstance.post(likeurl + `/likepost`, { post_id });
  return response.data;
});

// Unlike a post
export const unlikePost = createAsyncThunk('posts/unlikePost', async (post_id) => {
  const response = await axiosInstance.post(likeurl + `/unlikepost`, { post_id });
  return response.data;
});

// Add a comment to a post (Create)
export const addComment = createAsyncThunk('posts/addComment', async ({ postId, comment }) => {
  const response = await axiosInstance.post(commenturl + `/${postId}/comment`, { comment });
  return response.data;
});

// Fetch comments for a post (Read)
export const fetchComments = createAsyncThunk('posts/fetchComments', async (postId) => {
  const response = await axiosInstance.get(commenturl + `/${postId}/comments`);
  return response.data.comments; // Assuming the comments are in the "comments" field
});

// Edit a comment (Update)
export const editComment = createAsyncThunk('posts/editComment', async ({ postId, commentId, comment }) => {
  const response = await axiosInstance.put(commenturl + `/${postId}/comment/${commentId}`, { comment });
  return response.data;
});

// Delete a comment (Delete)
export const deleteComment = createAsyncThunk('posts/deleteComment', async ({ postId, commentId }) => {
  await axiosInstance.delete(commenturl + `/${postId}/comment/${commentId}`);
  return commentId;
});

// Initial state
const initialState = {
  posts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Post slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload; // Update the state with fetched posts
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Create a post
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // Add the new post at the beginning of the list
      });

    // Delete a post
    builder
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      });

    // Edit a post
    builder
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload; // Update the post with new data
        }
      });

    // Like or unlike a post
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload; // Update the post's like count and status
        }
      });

    // Add a comment to a post
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index].comments = action.payload.comments; // Update the post's comments
        }
      });

    // Fetch comments
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.meta.arg);
        if (index !== -1) {
          state.posts[index].comments = action.payload; // Update the post's comments with fetched ones
        }
      });

    // Edit a comment
    builder
      .addCase(editComment.fulfilled, (state, action) => {
        const { postId, commentId, comment } = action.meta.arg;
        const postIndex = state.posts.findIndex((post) => post._id === postId);
        if (postIndex !== -1) {
          const commentIndex = state.posts[postIndex].comments.findIndex((com) => com._id === commentId);
          if (commentIndex !== -1) {
            state.posts[postIndex].comments[commentIndex].text = comment;
          }
        }
      });

    // Delete a comment
    builder
      .addCase(deleteComment.fulfilled, (state, action) => {
        const postIndex = state.posts.findIndex((post) => post.comments.some((com) => com._id === action.meta.arg.commentId));
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter((com) => com._id !== action.meta.arg.commentId);
        }
      });
  },
});

// Export the async actions and reducer
export default postSlice.reducer;
