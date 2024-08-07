import express from 'express'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createStory, deleteStory, getStoryById } from '../controllers/story.controller.js';
const router=express.Router();

router.post('/stories/:userId', verifyJWT,upload.single('media'), createStory);
router.get('/stories/:id', verifyJWT, getStoryById);
router.delete('/stories/:id', verifyJWT, deleteStory);
export default router