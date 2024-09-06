import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import app from './app.js';
import http from 'http';

dotenv.config({ path: './.env' });

const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`⚙️  Server is running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
