import mongoose from "mongoose";
import Follow from "../models/follow.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a follow relationship
const createFollow = asyncHandler(async (req, res) => {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
        return res.status(400).json(new ApiResponse(400, null, "User and following fields are required"));
    }
    if (followerId === followingId) {
        return res.status(400).json(new ApiResponse(400, null, "User cannot follow themselves"));
    }

    const isFollowExists = await Follow.findOne({ followerId, followingId });
    if (isFollowExists) {
        return res.status(400).json(new ApiResponse(400, null, "Follow relationship already exists"));
    }

    const follow = await Follow.create({ followerId, followingId });
    res.status(201).json(new ApiResponse(201, follow, "Follow relationship created successfully"));
});

// Remove a follow relationship
const removeFollow = asyncHandler(async (req, res) => {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
        return res.status(400).json(new ApiResponse(400, null, "User and following fields are required"));
    }

    const follow = await Follow.findOneAndDelete({ followerId, followingId });
    if (!follow) {
        return res.status(404).json(new ApiResponse(404, null, "Follow relationship not found"));
    }

    res.status(200).json(new ApiResponse(200, null, "Follow relationship removed successfully"));
});

// Get followers of a user
const getFollowers = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed as a route parameter
    const currentUserId = req.user._id; // Current user ID from authenticated session

    const followers = await Follow.find({ followingId: id })
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
});

// Get following users of a user
const getFollowing = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed as a route parameter
    const currentUserId = req.user._id;

    const following = await Follow.find({ followerId: currentUserId }).populate('followingId', 'username email profilePicture');

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
});

// Count followers of a user
const countFollowers = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed as a route parameter
    const followerCount = await Follow.countDocuments({ followingId: id });

    res.status(200).json(new ApiResponse(200, followerCount, "Follower count fetched successfully"));
});

// Count following users of a user
const countFollowing = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed as a route parameter
    const followingCount = await Follow.countDocuments({ followerId: id });

    res.status(200).json(new ApiResponse(200, followingCount, "Following count fetched successfully"));
});

// Get following of the current user
const getFollowingOfCurrentUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id; // Get the current user ID from the session

    // Fetch following relationships for the current user
    const userFollowing = await Follow.find({ followerId: currentUserId }).select('followingId');

    const followingIds = userFollowing.map(follow => follow.followingId.toString());

    if (followingIds.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No following found"));
    }

    // Return the array of following IDs
    res.status(200).json(new ApiResponse(200, followingIds, "Following fetched successfully"));
});

export {
    createFollow,
    removeFollow,
    getFollowers,
    getFollowing,
    countFollowers,
    countFollowing,
    getFollowingOfCurrentUser
};
