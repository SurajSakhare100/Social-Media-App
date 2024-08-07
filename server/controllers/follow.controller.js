import mongoose from "mongoose";
import Follow from "../models/follow.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a follow relationship
const createFollow = asyncHandler(async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId) {
      return res.status(400).json(new ApiResponse(400, null, "User and following fields are required"));
    }
    if (followerId === followingId) {
      return res.status(400).json(new ApiResponse(400, null, "User cannot follow themselves"));
    }
    const isfollowExit = await Follow.find({ followerId, followingId })
    if(isfollowExit.length>0){
      return res.status(400).json(new ApiResponse(400, null, "Follow already existed"));
    }
    const follow = await Follow.create({ followerId, followingId });
    res.status(201).json(new ApiResponse(201, follow, "Follow created successfully"));
  } catch (error) {
    console.error("Error creating follow:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

// Remove a follow relationship
const removeFollow = asyncHandler(async (req, res) => {
  const { followerId, followingId } = req.body;
  if (!followerId || !followingId) {
    return res.status(400).json(new ApiResponse(400, null, "User and following fields are required"));
  }

  try {
    const follow = await Follow.findOneAndDelete({ followerId, followingId });
    if (!follow) {
      return res.status(404).json(new ApiResponse(404, null, "Follow relationship not found"));
    }

    res.status(200).json(new ApiResponse(200, null, "Follow relationship removed successfully"));
  } catch (error) {
    console.error("Error removing follow:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

// Get followers of a user
const getFollowers = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const currentUserId = req.user._id; // Assuming you have user authentication and the current user ID is available

    const followers = await Follow.find({ followingId: userId })
      .populate('followerId', 'username email profilePicture profileName');

    const userFollowing = await Follow.find({ followerId: currentUserId }).select('followingId');
    const userFollowingIds = userFollowing.map(follow => follow.followingId.toString());

    const followersWithIsFollowing = followers.map(follower => ({
      ...follower.toObject(),
      isFollowing: userFollowingIds.includes(follower.followerId._id.toString()),
    }));

    if (!followers.length) {
      return res.status(404).json(new ApiResponse(404, null, "No followers found"));
    }

    res.status(200).json(new ApiResponse(200, followersWithIsFollowing, "Followers fetched successfully"));
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

// Get following users of a user
const getFollowing = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id; 
    const following = await Follow.find({ followerId: userId })
      .populate('followingId', 'username email profilePicture');

    const userFollowing = await Follow.find({ followerId: currentUserId }).select('followingId');
    const userFollowingIds = userFollowing.map(follow => follow.followingId.toString());

    const followingWithIsFollowing = following.map(follow => ({
      ...follow.toObject(),
      isFollowing: userFollowingIds.includes(follow.followingId._id.toString()),
    }));

    if (!following.length) {
      return res.status(404).json(new ApiResponse(404, null, "No following found"));
    }

    res.status(200).json(new ApiResponse(200, followingWithIsFollowing, "Following fetched successfully"));
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});


// Count followers of a user
const countFollowers = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const followerCount = await Follow.countDocuments({ followingId: userId });

    res.status(200).json(new ApiResponse(200, followerCount, "Follower count fetched successfully"));
  } catch (error) {
    console.error("Error counting followers:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

// Count following users of a user
const countFollowing = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const followingCount = await Follow.countDocuments({ followerId: userId });

    res.status(200).json(new ApiResponse(200, followingCount, "Following count fetched successfully"));
  } catch (error) {
    console.error("Error counting following:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

// Get following of a current user
const getFollowingOfCurrentUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch followers where the given user is following others
    const userFollowing = await Follow.find({ followerId: userId }).select('followingId');

    // Extracting just the following IDs into an array
    const followingIds = userFollowing.map(follow => follow.followingId);

    if (followingIds.length === 0) {
      return res.status(404).json(new ApiResponse(404, null, "No following found"));
    }

    // Return the array of following IDs
    res.status(200).json(new ApiResponse(200, followingIds, "Following fetched successfully"));
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});


export { createFollow, removeFollow, getFollowers, getFollowing, countFollowers, countFollowing,getFollowingOfCurrentUser };
