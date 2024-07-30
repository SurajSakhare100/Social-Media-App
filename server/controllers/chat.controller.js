import mongoose from "mongoose";
import Message from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get messages between two users
export const getMessages = asyncHandler(async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "profileName profilePicture")
      .populate("receiver", "profileName profilePicture");

    res
      .status(201)
      .json(new ApiResponse(201, messages, "messages get successfully"));
  } catch (error) {
    console.error("Error to get messages:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

// Get last message for each chat user
export const getChatUser = asyncHandler(async (req, res) => {
  try {
    const { user } = req.params;
    const userId = new mongoose.Types.ObjectId(user);

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          "userDetails.username": 1,
          "userDetails.email": 1,
          "userDetails.profileName": 1,
          "userDetails.profilePicture": 1,
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages retrieved successfully"));
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});
