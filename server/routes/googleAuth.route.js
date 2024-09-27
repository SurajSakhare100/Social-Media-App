import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleLogin } from '../controllers/googleAuth.controller.js';

const router = express.Router();

// Configure Google strategy for Passport
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI, // Use environment variable
},
(accessToken, refreshToken, profile, done) => {
  // You could handle additional user creation logic here if needed
  done(null, profile);
}));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route for initiating Google login
router.get('/google/login', googleLogin); // Custom login logic, make sure it's integrated well

// Route for Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), // Redirect on failure
  (req, res) => {
    // Successful authentication, redirect to client URL
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
);

export default router;
