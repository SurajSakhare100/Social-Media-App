// storySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base } from "../../index.js";

const storyUrl =  `${base}/api/v1/story`;

// Axios instance for requests
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

// Async thunk for creating a story
export const createStory = createAsyncThunk(
  "stories/createStory",
  async ({ userId, formData }) => {
    const response = await axiosInstance.post(
      `${storyUrl}/createstory/${userId}`,
      formData
    );

    return response.data; // Assuming the API returns the created story
  }
);

// Async thunk for fetching stories
export const fetchStories = createAsyncThunk(
  "stories/fetchStories",
  async () => {
    const response = await axiosInstance.get(`${storyUrl}/getstory`);
    return response.data; // Assuming the API returns an array of stories
  }
);
// Async thunk for fetching stories
export const fetchStoriesbyUser = createAsyncThunk(
  "stories/fetchStoriesbyUser",
  async (userId) => {
    const response = await axiosInstance.get(`${storyUrl}/user/${userId}`);
    return response.data; // Assuming the API returns an array of stories
  }
);

// Async thunk for updating a story
export const updateStory = createAsyncThunk(
  "stories/updateStory",
  async ({ userId, storyId, formData }) => {
    const response = await axiosInstance.put(
      `${storyUrl}/${userId}/${storyId}`,
      formData
    );
    return response.data; // Assuming the API returns the updated story
  }
);

// Async thunk for deleting a story
export const deleteStory = createAsyncThunk(
  "stories/deleteStory",
  async ( id ) => {
    
    await axiosInstance.delete(`${storyUrl}/${id}`);
    return storyId; // Return the ID of the deleted story
  }
);
export const fetchStoryById = createAsyncThunk(
  "stories/fetchStoryById",
  async (storyId) => {
    const response = await axiosInstance.get(`${storyUrl}/${storyId}`); // Adjust your API endpoint
    return response.data.data; // Adjust based on your API response
  }
);

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    stories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle create story
    builder
      .addCase(createStory.fulfilled, (state, action) => {
        state.stories.push(action.payload.story); // Add the new story to the stories array
      })
      .addCase(createStory.rejected, (state) => {
        state.error = "Failed to upload story. Please try again."; // Set error message
      });

    // Handle fetch stories
    builder
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.stories = action.payload.data; // Update stories with fetched data
      })
      .addCase(fetchStories.rejected, (state) => {
        state.error = "Failed to fetch stories. Please try again."; // Set error message
      });
    builder
      .addCase(fetchStoriesbyUser.fulfilled, (state, action) => {
        state.stories = action.payload.data; // Update stories with fetched data
      })
      .addCase(fetchStoriesbyUser.rejected, (state) => {
        state.error = "Failed to fetch stories. Please try again."; // Set error message
      });

    // Handle update story
    builder
      .addCase(updateStory.fulfilled, (state, action) => {
        const index = state.stories.findIndex(
          (story) => story._id === action.payload.story._id
        );
        if (index !== -1) {
          state.stories[index] = action.payload.story; // Update the specific story
        }
      })
      .addCase(updateStory.rejected, (state) => {
        state.error = "Failed to update story. Please try again."; // Set error message
      });

    // Handle delete story
    builder
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.stories = state.stories.filter(
          (story) => story._id !== action.payload
        ); // Remove the deleted story
      })
      .addCase(deleteStory.rejected, (state) => {
        state.error = "Failed to delete story. Please try again."; // Set error message
      });

    builder
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.currentStory = action.payload;
      });
  },
});

// Export actions
export const { clearError } = storiesSlice.actions;

// Selector to get stories
export const selectStories = (state) => state.stories.stories;
export const selectCurrentStory = (state) => state.stories.currentStory;
// Export reducer
export default storiesSlice.reducer;
