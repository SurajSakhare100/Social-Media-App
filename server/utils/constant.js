// config.js
export const DB_NAME = "socialdb";

export const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // Ensure this is true for HTTPS in production
  sameSite: 'None',  // Required for cross-site cookies
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),  // Expires in 3 days
  domain: process.env.NODE_ENV === 'production' ? 'dev-net-backend.onrender.com' : 'localhost',  // Use the appropriate domain
};