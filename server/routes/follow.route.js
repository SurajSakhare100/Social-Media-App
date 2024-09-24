import express from 'express';
import { createFollow, removeFollow, getFollowers, getFollowing, countFollowers, countFollowing, getFollowingOfCurrentUser } from '../controllers/follow.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/handleFollow', verifyJWT,createFollow);
router.delete('/handleUnfollow', verifyJWT,removeFollow);
router.get('/getFollowers/:id',verifyJWT, getFollowers);
router.get('/getFollowing/:id',verifyJWT, getFollowing);
router.get('/countFollowers/:id',verifyJWT, countFollowers);
router.get('/countFollowing/:id',verifyJWT, countFollowing);
router.get('/getFollowingOfCurrentUser',verifyJWT, getFollowingOfCurrentUser);

export default router;
