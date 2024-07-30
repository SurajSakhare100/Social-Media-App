import express from 'express'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createStory } from '../controllers/story.controller.js';
const router=express.Router();
router.post('/likePost',verifyJWT, createStory);
export default router