import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPosts, uploadPost, likePost, unlikePost } from '../../api';

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
};

export const fetchAllPosts = createAsyncThunk('post/fetchAllPosts', async () => {
  const response = await getAllPosts();
  return response;
});

export const addNewPost = createAsyncThunk('post/addNewPost', async (post) => {
  const response = await uploadPost(post);
  return response;
});

export const like = createAsyncThunk('post/like', async ({ post_id, user_id }) => {
  const response = await likePost(post_id, user_id);
  return response;
});

export const unlike = createAsyncThunk('post/unlike', async ({ post_id, user_id }) => {
  const response = await unlikePost(post_id, user_id);
  return response;
});

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(like.fulfilled, (state, action) => {
        const post = state.posts.find(post => post.id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
        }
      })
      .addCase(unlike.fulfilled, (state, action) => {
        const post = state.posts.find(post => post.id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
        }
      });
  },
});

export default postSlice.reducer;
