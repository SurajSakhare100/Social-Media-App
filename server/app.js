import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Middleware
app.use(cors({
  origin: clientURL, // Allow requests from this origin
  credentials: true, // Allow credentials (e.g., cookies) to be sent
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    ttl: 14 * 24 * 60 * 60 // = 14 days
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes
app.use('/auth', googleAuthRoute);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1/story', storyRouter);
app.use('', EmailRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;
