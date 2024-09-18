import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.route.js';
import userRouter from './routes/user.route.js';
import likeRouter from './routes/like.route.js';
import googleAuthRoute from './routes/googleAuth.route.js';
import followRouter from './routes/follow.route.js';
import commentRouter from './routes/comment.route.js';
import EmailRouter from './utils/nodeMailer.js';
import chatRouter from './routes/chat.route.js';
import storyRouter from './routes/story.route.js';
import storySockets from './socket.js';
import http from 'http'; 
import { Server } from 'socket.io';

const app = express();
const clientURL ='http://localhost:5173';
console.log(clientURL)
app.use(cors({
  origin: clientURL,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Object to store user socket mappings
const users = {};

// Socket.IO setup for chat and real-time events
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
      await sendMessage(newMessage); // Assuming `sendMessage` is a function that handles saving

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

// Initialize storySockets with the `io` instance
storySockets(io);

// Routes
app.use('/auth', googleAuthRoute);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1/story', storyRouter);
app.use('/email', EmailRouter); // Adjust route prefix if necessary

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;
