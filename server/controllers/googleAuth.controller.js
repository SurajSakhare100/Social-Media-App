import axios from 'axios';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { options } from '../utils/constant.js';
import { generateTokens } from './user.controller.js';

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

export const googleLoginAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Access token not provided' });
        }

        // Get user info from Google using access token
        const userInfo = await getGoogleUserInfo(token);

        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            if (!userInfo.email || !userInfo.name) {
                return res.status(400).json({ message: 'Incomplete user information from Google' });
            }

            // Create new user if not found
            user = new User({
                username: userInfo.name.toLowerCase(),
                email: userInfo.email,
                profileName: userInfo.name,
                profilePicture: userInfo.picture,
                password: null,  // No password for Google login users
                provider: 'google',
            });

            await user.save();
        }
        const { accessToken, refreshToken } = await generateTokens(user._id);
        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { ...user.toObject(), password: undefined },
            "Logged in successfully"
          )
        );
    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message,
        });
    }
};
