import express from 'express'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createStory, deleteStory, getStories } from '../controllers/story.controller.js';
const router=express.Router();

router.post('/createstory/:userId', verifyJWT,upload.single('story'), createStory);
router.get('/getstory', verifyJWT, getStories);
router.delete('/stories/:id', verifyJWT, deleteStory);
export default router