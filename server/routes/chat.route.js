import express from 'express';
import { sendMessage, getMessages, getChatUser } from '../controllers/chat.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/messages', getMessages);
router.get('/getChatUser/:user', getChatUser);

export default router;
