import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const posturl = "http://localhost:3000/api/v1/posts";
const likeurl = "http://localhost:3000/api/v1/like";
const commenturl = "http://localhost:3000/api/v1/comments";

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
  return response.data.data;
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
export const likePost = createAsyncThunk('posts/likePost', async (postId) => {
  const response = await axiosInstance.post(likeurl + `/likepost`, { postId });
  return response.data;
});

// Unlike a post
export const unlikePost = createAsyncThunk('posts/unlikePost', async (postId) => {
  const response = await axiosInstance.post(likeurl + `/unlikepost`, { postId });
  return response.data;
});

// Add a comment to a post (Create)
export const addComment = createAsyncThunk('posts/addComment', async ({ postId, userComment }) => {
  const response = await axiosInstance.post(`${commenturl}/${postId}`, { userComment });
  return response.data;
});

// Fetch comments for a post (Read)
export const fetchComments = createAsyncThunk('posts/fetchComments', async (postId) => {
  const response = await axiosInstance.get(`${commenturl}/${postId}`);
  return response.data.data;
});

// Edit a comment (Update)
export const editComment = createAsyncThunk('posts/editComment', async ({ postId, commentId, userComment }) => {
  console.log(userComment)
  const response = await axiosInstance.put(`${commenturl}/${postId}/${commentId}`, { userComment });
  return response.data.data;
});

// Delete a comment (Delete)
export const deleteComment = createAsyncThunk('posts/deleteComment', async ({ postId, commentId }) => {
  await axiosInstance.delete(`${commenturl}/${postId}/${commentId}`);
  return { postId, commentId };
});

// Initial state
const initialState = {
  posts: [],
  status: 'idle',
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
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Create a post
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.unshift(action.payload);
    });

    // Delete a post
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    });

    // Edit a post
    builder.addCase(editPost.fulfilled, (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    });

    // Add a comment
    builder.addCase(addComment.fulfilled, (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.payload.postId);
      if (index !== -1) {
        state.posts[index].comments.push(action.payload.comment); // Ensure the comment is added correctly
      }
    });

    // Fetch comments
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.meta.arg);
      if (index !== -1) {
        state.posts[index].comments = action.payload; // Update with fetched comments
      }
    });

    // Edit a comment
    builder.addCase(editComment.fulfilled, (state, action) => {
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
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const postIndex = state.posts.findIndex((post) => post._id === action.payload.postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments = state.posts[postIndex].comments.filter((com) => com._id !== action.payload.commentId);
      }
    });
  },
});

// Export the reducer
export default postSlice.reducer;
