import express from 'express';
import { createFollow, removeFollow, getFollowers, getFollowing, countFollowers, countFollowing, getFollowingOfCurrentUser } from '../controllers/follow.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/handleFollow', verifyJWT,createFollow);
router.delete('/handleUnfollow', verifyJWT,removeFollow);
router.get('/getFollowers/:userId',verifyJWT, getFollowers);
router.get('/getFollowing/:userId',verifyJWT, getFollowing);
router.get('/countFollowers/:userId',verifyJWT, countFollowers);
router.get('/countFollowing/:userId',verifyJWT, countFollowing);
router.get('/getFollowingOfCurrentUser/:userId',verifyJWT, getFollowingOfCurrentUser);

export default router;
