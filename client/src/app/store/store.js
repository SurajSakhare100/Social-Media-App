import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice.js';
import postReducer from '../slices/postSlice.js';
import storyReducer from '../slices/storySlice.js';
import followSlice from '../slices/followSlice.js';
const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
    stories: storyReducer,
    follow: followSlice,
  },
});

export default store;
