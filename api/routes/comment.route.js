import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getAllCommentsOfPost } from '../controllers/comment.controller.js';
const router=express.Router();
router.get('/getallcomments/:postId',verifyJWT, getAllCommentsOfPost);
export default router