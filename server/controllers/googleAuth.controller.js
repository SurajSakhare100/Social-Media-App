import axios from 'axios';
import User from '../models/user.model.js';
import { options } from '../utils/constant.js';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

// Function to get Google OAuth tokens
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

// Function to fetch Google user information
const getGoogleUserInfo = async (access_token) => {
    const { data } = await axios.get(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return data;
};

// Google login controller
export const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;

        // Exchange code for tokens
        const googleTokens = await getGoogleTokens(code);
        const { access_token } = googleTokens;

        // Get user info from Google
        const userInfo = await getGoogleUserInfo(access_token);

        // Check if user exists
        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            // Validate necessary userInfo fields
            if (!userInfo.name || !userInfo.email) {
                return res.status(400).json({ message: 'User information is incomplete.' });
            }

            // Create a new user if not found
            user = await User.create({
                username: userInfo.name, // Google name as username
                email: userInfo.email,
                profileName: userInfo.name,
                profilePicture: userInfo.picture,
                password: null, // No password for OAuth users
                provider: "google", // Indicate Google as provider
            });

            console.log('New user created:', user.email);
        }

        // Generate JWT tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        // Send tokens in cookies
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Logged in successfully",
                user: { username: user.username, email: user.email, profilePicture: user.profilePicture },
            });

    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.status(500).json({ message: 'Authentication failed.', error: error.message });
    }
};
