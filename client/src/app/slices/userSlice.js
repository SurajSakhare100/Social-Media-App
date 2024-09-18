import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3000/api/v1/";
const initialState = {
  _id: null,
  username: "",
  profileName: "",
  email: "",
  profilePicture: "",
  bio: "",
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunks for async actions
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(url + "user/getuser", {
        withCredentials: true,
      }); // API endpoint for getting current user
      return response.data.data; // Assuming the API wraps the user data in `data` field
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch user"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(url + "user/login", userData, {
        withCredentials: true,
      }); // Login API
      return response.data.data; // Assuming successful login returns user data in `data`
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(url + "user/logout", null, { withCredentials: true }); // Logout API
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Logout failed");
    }
  }
);
// Thunk for updating user details
export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(url + "user/update", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
          withCredentials: true,
        
      }); // API endpoint for updating user details
      return response.data.data; // Assuming the API wraps the updated user data in `data` field
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to update user details"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserProfile(state, action) {
      const { name, profilePicture, bio } = action.payload;
      state.name = name;
      state.profilePicture = profilePicture;
      state.bio = bio;
    },
  },
  extraReducers: (builder) => {
    // Handling fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        return {
          ...action.payload,
          isAuthenticated: true,
          status: "succeeded",
        };
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handling loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        return {
          ...action.payload,
          isAuthenticated: true,
          status: "succeeded",
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handling logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState, status: "idle" };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    // Handling updateUserDetails
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        return { ...state, ...action.payload, status: "succeeded" };
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
