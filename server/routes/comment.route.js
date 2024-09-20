import express from 'express';
import { getAllCommentsOfPost, createComment, updateComment, deleteComment } from '../controllers/comment.controller.js';

const router = express.Router();

// Fetch all comments for a specific post
router.get('/posts/:postId/comments', getAllCommentsOfPost);

// Create a comment for a specific post
router.post('/posts/:postId/comments', createComment);

// Update a specific comment
router.put('/comments/:commentId', updateComment);

// Delete a specific comment
router.delete('/comments/:commentId', deleteComment);

export default router;
