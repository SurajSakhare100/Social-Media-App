import express from 'express';
import {googleLoginAuth} from '../controllers/googleAuth.controller.js'
const router = express.Router();


// Route for handling Google OAuth login
router.post('/google', googleLoginAuth);

export default router;
