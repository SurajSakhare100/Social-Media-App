import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Verification from '../models/verification.model.js';

const router = express.Router();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/send-code', async (req, res) => {
    const { email } = req.body;
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    try {
        // Create or update verification entry
        await Verification.findOneAndUpdate(
            { email },
            { verificationCode: code, expiresAt },
            { upsert: true }
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is ${code}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email.');
            }
            res.send('Verification code sent.');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error.');
    }
});

router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const verification = await Verification.findOne({ email });

        if (verification && verification.verificationCode === code && verification.expiresAt > Date.now()) {
            res.send({ message: 'Code verified successfully!' });
        } else {
            res.status(400).send('Invalid or expired code.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error.');
    }
});

export default router;
