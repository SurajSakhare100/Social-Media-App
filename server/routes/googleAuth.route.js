import express from 'express';
import { googleLogin } from '../controllers/authController.js';

const router = express.Router();

// Route for handling Google OAuth login
router.get('/google', googleLogin);

export default router;
