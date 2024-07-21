import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createComment, getAllCommentsOfPost, updateComment } from '../controllers/comment.controller.js';
const router=express.Router();
router.get('/getallcomments/:postId',verifyJWT, getAllCommentsOfPost);
router.get('/updateComment/:commentId',verifyJWT, updateComment);
router.post('/createComment',verifyJWT, createComment);
export default router