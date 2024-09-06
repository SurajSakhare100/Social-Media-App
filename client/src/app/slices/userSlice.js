import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  email: '',
  profilePicture: '',
  followers: [],
  following: [],
  posts: [],
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return {...action.payload, isAuthenticated: true };
    },
    updateUserProfile(state, action) {
      const { name, profilePicture } = action.payload;
      state.name = name;
      state.profilePicture = profilePicture;
    },
    logoutUser(state) {
      return { ...initialState, isAuthenticated: false };
    },
  },
});
export const { setUser, updateUserProfile, logoutUser } = userSlice.actions;
export default userSlice.reducer;
