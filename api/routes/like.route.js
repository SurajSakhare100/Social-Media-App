import express from 'express'
import { likePost } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.post('/addlike',verifyJWT, likePost);
export default router