import axios from 'axios';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { options } from '../utils/constant.js';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

// Function to get Google OAuth tokens
const getGoogleTokens = async (code) => {
    try {
        const { data } = await axios.post(GOOGLE_TOKEN_URL, {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        });
        return data;
    } catch (error) {
        throw new Error('Failed to fetch Google OAuth tokens');
    }
};

// Function to fetch Google user information
const getGoogleUserInfo = async (access_token) => {
    try {
        const { data } = await axios.get(GOOGLE_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return data;
    } catch (error) {
        throw new Error('Failed to fetch Google user info');
    }
};

// Google login controller
export const googleLoginAuth = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ message: 'Authorization code not provided' });
        }

        // Exchange code for Google OAuth tokens
        const googleTokens = await getGoogleTokens(code);
        const { access_token } = googleTokens;

        // Get user info from Google using access token
        const userInfo = await getGoogleUserInfo(access_token);

        // Find the user by email or create a new one if it doesn't exist
        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            if (!userInfo.email || !userInfo.name) {
                return res.status(400).json({ message: 'Incomplete user information from Google' });
            }

            // Create a new user if not found
            user = new User({
                username: userInfo.name, 
                email: userInfo.email,
                profileName: userInfo.name,
                profilePicture: userInfo.picture,
                password: null,  // No password for Google login users
                provider: 'google',
            });

            await user.save();
            console.log('New user created:', user.email);
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Save refresh token in user document
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookies with tokens and respond with user data
        res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                success: true,
                message: 'Logged in successfully',
                user: {
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                },
            });
    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message,
        });
    }
};
