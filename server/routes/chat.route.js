import express from 'express';
import { sendMessage, getMessages, getChatUser } from '../controllers/chat.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send', verifyJWT,sendMessage);
router.get('/messages',verifyJWT, getMessages);
router.get('/getChatUser/:user',verifyJWT, getChatUser);

export default router;
