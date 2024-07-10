import express from 'express'
import { upload } from "../middlewares/multer.middleware.js";
import { getAllPosts, getPostByUserId, uploadPosts } from "../controllers/post.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router=express.Router();

router.post('/uploadpost',verifyJWT,upload.single('post_image'),uploadPosts);
router.get('/getAllPosts/:userId',verifyJWT,getAllPosts)
router.get('/getpostbyuserid/:id',getPostByUserId)

export default router