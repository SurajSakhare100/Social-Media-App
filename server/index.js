import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { initializeSockets } from './socket.js';

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000; // Use port 3000

// Create HTTP server
const server = http.createServer(app);
const clientURL = process.env.CLIENT_URL
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: clientURL,  // Frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize socket handlers
initializeSockets(io);

// Start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`⚙️  Server is running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
