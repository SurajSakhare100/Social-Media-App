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

const app = express();
const clientURL = 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: clientURL,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/auth', googleAuthRoute);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1/story', storyRouter);
app.use('/api/v1/email', EmailRouter);

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
