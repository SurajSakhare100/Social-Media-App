import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const url = "http://localhost:3000/api/v1/posts";
const handleResponse = (res) => res.data.data;
const handleError = (err) => {
  console.log(err.message);
  return [];
};
// Async actions (thunks)
const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
// Fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axiosInstance.get(url+'/getallposts');
  return handleResponse(response);
});

// Create a new post
export const createPost = createAsyncThunk('posts/createPost', async (newPostData) => {
  const response = await axiosInstance.post(url+'/createpost', newPostData);
  return response.data;
});

// Delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
  await axiosInstance.delete(url+`/deletepost/${postId}`);
  return postId;
});

// Edit a post
export const editPost = createAsyncThunk('posts/editPost', async ({ postId, updatedData }) => {
  const response = await axios.put(url+`/${postId}`, updatedData);
  return response.data;
});

// Like or unlike a post
export const likePost = createAsyncThunk('posts/likePost', async (postId) => {
  const response = await axios.post(url+`/${postId}/like`);
  return response.data;
});

// Add a comment to a post
export const addComment = createAsyncThunk('posts/addComment', async ({ postId, comment }) => {
  const response = await axios.post(url+`/${postId}/comment`, { comment });
  return response.data;
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
  },
});

// Export the async actions and reducer
export default postSlice.reducer;
