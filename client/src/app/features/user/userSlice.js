import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from '../../../index.js';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const fetchCurrentUser = createAsyncThunk('user/fetchCurrentUser', async () => {
  const response = await getCurrentUser();
  return response;
});

export const login = createAsyncThunk('user/login', async (user) => {
  const response = await loginUser(user);
  return response;
});

export const register = createAsyncThunk('user/register', async (user) => {
  const response = await registerUser(user);
  return response;
});

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await logoutUser();
  return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default userSlice.reducer;
