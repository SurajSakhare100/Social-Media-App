import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.route.js';
import userRouter from './routes/user.route.js';
import likeRouter from './routes/like.route.js';
import followRouter from './routes/follow.route.js';
import commentRouter from './routes/comment.route.js';
import chatRouter from './routes/chat.route.js';
import storyRouter from './routes/story.route.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow credentials (e.g., cookies) to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1/story', storyRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app; // Use default export
