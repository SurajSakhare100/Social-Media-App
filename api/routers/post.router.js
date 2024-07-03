import express from 'express'
import { upload } from "../middlewares/multer.middleware.js";
import { getAllPosts, uploadPosts } from "../controllers/post.controller.js";

const router=express.Router();

router.post('/uploadpost',upload.single('post_image'),uploadPosts);
router.get('/getAllPosts',getAllPosts)

export default router