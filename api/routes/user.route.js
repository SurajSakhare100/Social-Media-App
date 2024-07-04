import express from 'express'
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router=express.Router();

router.post('/registerUser',upload.single('profilePic'),registerUser);
router.post('/loginUser',loginUser);
router.post('/logout',verifyJWT, logoutUser);
router.post('/updatepassword',verifyJWT, changeCurrentPassword);
router.get('/getuser',verifyJWT, getCurrentUser);
export default router