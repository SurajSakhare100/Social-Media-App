import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { initializeSockets } from './socket.js';

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000;  // Use port from .env or default to 3000

// Create HTTP server
const server = http.createServer(app);
const clientURL ='https://itsdevnet.vercel.app';
// const clientURL ='http://localhost:5173';

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
