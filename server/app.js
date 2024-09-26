// app.js
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
const clientURL = process.env.CLIENT_URL || 'https://itsdevnet.vercel.app';

// Middleware
// Allow only your frontend's origin
const corsOptions = {
  origin: clientURL,  // Use clientURL to handle dynamically
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // This allows cookies to be sent with requests
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));  // Apply CORS middleware with options

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/auth', googleAuthRoute);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1/story', storyRouter);
app.use('/api/v1/email', EmailRouter);

// Error handling middleware (optional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true'); // Ensure credentials allowed
  next();
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;
