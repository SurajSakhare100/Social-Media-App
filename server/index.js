import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import { Server } from 'socket.io';
import http from 'http';
import app from './app.js';
import { sendMessage } from './controllers/chat.controller.js';

// Ensure the correct path to the .env file
dotenv.config({ path: './.env' });

const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow WebSocket connections from this origin
    methods: ['GET', 'POST'],
  },
});

// Object to store user socket mappings
const users = {};

// Socket.IO setup
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register user when they emit 'register' event
  socket.on('register', (userId) => {
    users[userId] = socket.id; // Store socket ID for the user
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  // Handle receiving a new message
  socket.on('sendMessage', async (message) => {
    const { sender, receiver, content } = message;
    const newMessage = { sender, receiver, content };
    
    try {
      // Optionally save the message to the database
      // await Message.create(newMessage);
      await sendMessage(newMessage);

      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
      }

      socket.emit('messageSent', newMessage);
    } catch (err) {
      console.error('Error sending message:', err);
      socket.emit('error', 'Message could not be sent');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from the users object
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log(`User unregistered: ${userId}`);
        break;
      }
    }
  });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`⚙️  Server is running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
