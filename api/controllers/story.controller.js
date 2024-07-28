import Story from "../models/story.model.js";

// Create Story
const createStory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { expirationTime } = req.body;
    const mediaUrl = req.files[0].path; // Assuming you're using multer for file uploads
    const newStory = await Story.create({ userId, mediaUrl, expirationTime });
    res.status(201).json({ success: true, story: newStory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Story by ID
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
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
