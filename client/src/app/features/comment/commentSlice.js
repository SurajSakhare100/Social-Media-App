import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllComments, createComment } from '../../api';

const initialState = {
  comments: [],
  status: 'idle',
  error: null,
};

export const fetchAllComments = createAsyncThunk('comment/fetchAllComments', async (postId) => {
  const response = await getAllComments(postId);
  return response;
});

export const addNewComment = createAsyncThunk('comment/addNewComment', async ({ userComment, postId, userId }) => {
  const response = await createComment(userComment, postId, userId);
  return response;
});

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addNewComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      });
  },
});

export default commentSlice.reducer;
