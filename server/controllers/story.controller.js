import Story from "../models/story.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Follow from "../models/follow.model.js";

// Create Story
const createStory = async (req, res) => {
  try {
    const { userId } = req.params;
    const mediaUrl = req.file?.path;

    if (!mediaUrl) {
      throw new ApiError(400, "Story media is required");
    }

    const story_cloudinary = await uploadOnCloudinary(mediaUrl);

    if (!story_cloudinary) {
      throw new ApiError(400, "Failed to upload image to Cloudinary");
    }

    const newStory = await Story.create({
      userId: userId,
      mediaUrl: story_cloudinary.url,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          newStory,
          "Story created successfully with creator details"
        )
      );
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all stories of following users and the logged-in user
const getStories = async (req, res) => {
  try {
    // Get the logged-in user's ID from req.user
    const userId = req.user.id;

    // Fetch all users that the logged-in user is following
    const followingList = await Follow.find({ followerId: userId })

    if (!followingList || followingList.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "You are not following anyone."));
    }

    // Extract following IDs
    const followingIdsArray = followingList.map(f => f.followingId);

    // Include the logged-in user's own stories
    followingIdsArray.push(userId);

    // Fetch stories from the following users and the logged-in user
    const stories = await Story.find({
      userId: { $in: followingIdsArray },
    }).populate("userId", "username profileName profilePicture");
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.userId._id.toString();
      if (!acc[userId]) {
          acc[userId] = {
              userId: story.userId,
              stories: [],
          };
      }
      acc[userId].stories.push(story);
      return acc;
  }, {});
    res
      .status(200)
      .json(new ApiResponse(200, groupedStories, "Stories fetched successfully"));
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

// Get a single story by ID
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params; // Get the story ID from the request parameters
    const story = await Story.findById(id).populate("userId", "username profileName profilePicture"); // Fetch the story with populated userId

    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    res.status(200).json(new ApiResponse(200, story, "Story fetched successfully"));
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// Delete Story
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the story by ID
    const story = await Story.findById(id);

    // If the story does not exist, return a 404 error
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    // Check if the story belongs to the user making the request
    if (story.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this story" });
    }

    // Delete the story
    await Story.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export { createStory, getStories, deleteStory ,getStoryById};
