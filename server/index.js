import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { initializeSockets } from './socket.js';

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000;  // Use port from .env or default to 3000
const env = process.env.NODE_ENV ;  // Default to 'development' if NODE_ENV is not set
const clientURL =
  env === 'production'
    ? process.env.CLIENT_URL || 'https://itsdevnet.vercel.app'  // Use CLIENT_URL from .env or fallback to production URL
    : 'http://localhost:5173';  // Development URL

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with dynamic CORS origin
const io = new Server(server, {
  cors: {
    origin: clientURL,  // Use the clientURL from .env or default
    methods: ['GET', 'POST'],
    credentials: true,  // Allow credentials (cookies, etc.)
  },
});

// Initialize socket handlers
initializeSockets(io);

// Start the server and connect to MongoDB
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`⚙️  Server is running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
