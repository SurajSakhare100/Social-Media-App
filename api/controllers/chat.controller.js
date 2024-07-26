import Message from '../models/message.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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
export const getMessages =asyncHandler( async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    res.status(201).json(new ApiResponse(201, messages, "messages get successfully"));
  } catch (error) {
    console.error("Error to get messages:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});
