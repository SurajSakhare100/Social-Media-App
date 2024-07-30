import express from 'express';
import { getAllCommentsOfPost, createComment, updateComment, deleteComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.get('/comments/:postId', getAllCommentsOfPost);
router.post('/comments', createComment);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);

export default router;
