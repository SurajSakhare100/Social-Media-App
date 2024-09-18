import express from 'express';
import { upload } from "../middlewares/multer.middleware.js";
import {  changePassword, getAllUsers, getCurrentUser, getUserById, loginUser, logoutUser, registerUser, updateUserDetails } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/registerUser', upload.single('profilePicture'), registerUser);
router.post('/login',loginUser);  // No JWT verification needed for login
router.post('/logout', verifyJWT, logoutUser);
router.post('/updatepassword', verifyJWT, changePassword);
router.get('/getuser', verifyJWT, getCurrentUser);  // JWT verification needed
router.get('/getuser/:id', verifyJWT, getUserById);
router.get('/getalluser', verifyJWT, getAllUsers);
router.put('/update', verifyJWT, upload.single('profilePicture'), updateUserDetails);

export default router;
