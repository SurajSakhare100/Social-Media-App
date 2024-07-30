import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import postReducer from '../features/post/postSlice';
import commentReducer from '../features/comment/commentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    comment: commentReducer,
  },
});

export default store;
