import express from 'express'
import { likePost, unlikePost } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.post('/likePost',verifyJWT, likePost);
router.post('/unlikePost',verifyJWT, unlikePost);
export default router