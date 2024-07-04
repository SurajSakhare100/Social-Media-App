import express from 'express'
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword, getAllUser, getCurrentUser, getUserById, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router=express.Router();

router.post('/registerUser',upload.single('profilePic'),registerUser);
router.post('/loginUser',loginUser);
router.post('/logout',verifyJWT, logoutUser);
router.post('/updatepassword',verifyJWT, changeCurrentPassword);
router.get('/getuser',verifyJWT, getCurrentUser);
router.get('/getuser/:id',verifyJWT, getUserById);
router.get('/getalluser',verifyJWT, getAllUser);

export default router