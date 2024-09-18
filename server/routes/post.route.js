import express from 'express'
import { upload } from "../middlewares/multer.middleware.js";
import { deletePost, getAllPosts, getPostByUserId, uploadPosts } from "../controllers/post.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router=express.Router();

router.post('/createpost',verifyJWT,upload.single('post_image'),uploadPosts);
router.get('/getallposts',verifyJWT,getAllPosts)
router.delete('/deletepost/:id',verifyJWT,deletePost)
router.get('/getpostbyuser/:id',getPostByUserId)

export default router