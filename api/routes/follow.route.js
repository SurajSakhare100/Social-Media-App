import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createFollowers, getFollowers, removeFollower } from '../controllers/follow.controller.js';
const router=express.Router();
router.get('/getFollowers/:userId', getFollowers);
router.post('/handlefollow', createFollowers);
router.delete('/handleUnfollow', removeFollower);
export default router