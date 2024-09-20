import express from 'express'
import { likePost, unlikePost } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.post('/likepost',verifyJWT, likePost);
router.post('/unlikepost',verifyJWT, unlikePost);
export default router