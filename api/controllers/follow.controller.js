import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a follow relationship
const createFollowers = asyncHandler(async (req, res) => {
  try {
    const { user, following } = req.body;
    // Validate request data
    if (!user || !following) {
      return res
        .status(400)
        .json({ error: "User and following fields are required" });
    }
    if (user === following) {
      return res.status(400).json({ error: "User don't follow it self" });
    }
    const follow = await Follow.create({ user, following });
    res
      .status(201)
      .json(new ApiResponse(201, follow, "Follow created successfully"));
  } catch (error) {
    console.error("Error creating follow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove a follow relationship
const removeFollower = asyncHandler(async (req, res) => {
  const { user, following } = req.body;

  // Validate request data
  if (!user || !following) {
    return res
      .status(400)
      .json({ error: "User and following fields are required" });
  }

  try {
    const follow = await Follow.findOneAndDelete({ user, following });

    if (!follow) {
      return res.status(404).json({ error: "Follow relationship not found" });
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Follow relationship removed successfully")
      );
  } catch (error) {
    console.error("Error removing follow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get followers of a user
const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    // Find followers and populate user details
    const followers = await Follow.find({ following: userId }).populate(
      "user",
      "username email profilePicture"
    );

    // If no followers found, return a 404 response
    if (!followers.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No followers found"));
    }
    const userFollowing = await Follow.find({ following: req.user._id });

    // Return followers with user details
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          followers,
          "Followers fetched successfully with user details"
        )
      );
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { createFollowers, getFollowers, removeFollower };
