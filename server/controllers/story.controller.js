import Story from "../models/story.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

// Create Story
const createStory = async (req, res) => {
  try {
    const { userId } = req.params;
    const mediaUrl = req.file?.path;
    if (!mediaUrl) {
      throw new ApiError(400, "story is required");
    }
    const story_cloudinary = await uploadOnCloudinary(mediaUrl);
    if (!story_cloudinary) {
      throw new ApiError(400, "Failed to upload image");
    }
    const newStory = await Story.create({ userId:req.user._id, mediaUrl });
    req.io.emit('newStory', newStory);
    res.status(201).json(
      new ApiResponse(200, newStory, "story create successfully with creator details")
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Story by ID
const getStoryById = async (req, res) => {
  try {
    // const { id } = req.params;
    console.log('object')
    const story = await Story.find({});
    console.log(story,34)
    // const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }
    res.status(200).json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Delete Story
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStory = await Story.findByIdAndDelete(id);
    if (!deletedStory) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }
    res.status(200).json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { createStory, getStoryById, deleteStory };
