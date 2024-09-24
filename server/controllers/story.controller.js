// storyController.js
import Story from "../models/story.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create Story
const createStory = async (req, res) => {
  try {
    const { userId } = req.params;
    const mediaUrl = req.file?.path;

    if (!mediaUrl) {
      throw new ApiError(400, "Story is required");
    }

    const story_cloudinary = await uploadOnCloudinary(mediaUrl);

    if (!story_cloudinary) {
      throw new ApiError(400, "Failed to upload image");
    }

    const newStory = await Story.create({
      userId: userId,
      mediaUrl: story_cloudinary.url,
    }); // Use the URL from Cloudinary
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
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all stories
const getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      user: { $in: req.user.following },
    }).populate("user", "username profilePicture");

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

// Delete Story
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStory = await Story.findByIdAndDelete(id);

    if (!deletedStory) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { createStory, getStories, deleteStory };
