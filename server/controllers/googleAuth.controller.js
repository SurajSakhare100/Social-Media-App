import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { options } from '../utils/constant.js';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

const getGoogleTokens = async (code) => {
    const { data } = await axios.post(GOOGLE_TOKEN_URL, {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    });
    return data;
};

const getGoogleUserInfo = async (access_token) => {
    const { data } = await axios.get(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return data;
};

export const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;

        // Get tokens from Google
        const googleTokens = await getGoogleTokens(code);
        const { access_token } = googleTokens;

        // Get user information from Google
        const userInfo = await getGoogleUserInfo(access_token);

        // Check if the user already exists in the database by email
        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            // Validate userInfo data
            if (!userInfo.name || !userInfo.email) {
                return res.status(400).json({ message: 'User information is incomplete.' });
            }

            // If user doesn't exist, create a new user
            user = await User.create({
                username: userInfo.name, // Assuming Google name as username
                email: userInfo.email,
                profileName: userInfo.name,
                profilePicture: userInfo.picture,
                password: hashPassword('googlePassword'), // Hash the password
            });

            console.log('New user created:', user.email);
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save();

        // Send the JWT token back to the client
        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { ...user}, "Logged in successfully"));
    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.status(500).json({ message: 'Authentication failed.' });
    }
};

