import express from 'express';
import { getAllCommentsOfPost, createComment, updateComment, deleteComment } from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Fetch all comments for a specific post
router.get('/:postId',verifyJWT, getAllCommentsOfPost);

// Create a comment for a specific post
router.post('/:postId',verifyJWT, createComment);

// Update a specific comment
router.put('/:postId/:commentId',verifyJWT, updateComment);

// Delete a specific comment
router.delete('/:postId/:commentId',verifyJWT, deleteComment);

export default router;
