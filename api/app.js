import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.route.js';
import userRouter from './routes/user.route.js';
import likeRouter from './routes/like.route.js';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your frontend URL in production
    credentials: true // Allow cookies to be sent cross-origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/like', likeRouter);

// Default route
app.get('/', (req, res) => {
    res.send('Hello World');
});


export { app };
