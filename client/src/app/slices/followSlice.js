import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URLs
const follow_url = 'http://localhost:3000/api/v1/follow';

// Axios instance for requests
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// Thunks
export const createFollow = createAsyncThunk(
  'follow/createFollow',
  async ({ followerId, followingId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${follow_url}/handleFollow`, { followerId, followingId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFollow = createAsyncThunk(
  'follow/removeFollow',
  async ({ followerId, followingId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${follow_url}/handleUnfollow`, { data: { followerId, followingId } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  'follow/fetchFollowers',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${follow_url}/getFollowers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  'follow/fetchFollowing',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${follow_url}/getFollowing/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const countFollowers = createAsyncThunk(
  'follow/countFollowers',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${follow_url}/countFollowers/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const countFollowing = createAsyncThunk(
  'follow/countFollowing',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${follow_url}/countFollowing/${id}`);
      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const followSlice = createSlice({
  name: 'follow',
  initialState: {
    followers: [],
    following: [],
    followerCount: 0,
    followingCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Create Follow
    builder
      .addCase(createFollow.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFollow.fulfilled, (state, action) => {
        state.loading = false;
        state.following.push(action.payload.data);
      })
      .addCase(createFollow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to follow';
      });

    // Remove Follow
    builder
      .addCase(removeFollow.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFollow.fulfilled, (state, action) => {
        state.loading = false;
        state.following = state.following.filter(follow => follow._id !== action.payload.data._id);
      })
      .addCase(removeFollow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to unfollow';
      });

    // Fetch Followers
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.data;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch followers';
      });

    // Fetch Following
    builder
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload.data;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch following';
      });

    // Count Followers
    builder
      .addCase(countFollowers.pending, (state) => {
        state.loading = true;
      })
      .addCase(countFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followerCount = action.payload;
      })
      .addCase(countFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to count followers';
      });

    // Count Following
    builder
      .addCase(countFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(countFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.followingCount = action.payload;
      })
      .addCase(countFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to count following';
      });
  },
});

export default followSlice.reducer;
