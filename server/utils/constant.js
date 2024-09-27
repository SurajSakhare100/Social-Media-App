export const DB_NAME = "socialdb";
export const options = {
    httpOnly: true,
    secure: true,  // Ensure this is true for HTTPS
    sameSite: 'None',  // Required for cross-site cookies
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),  // Expires in 3 days
    domain: 'dev-net-backend.onrender.com',  // Or use the appropriate backend domain
    // domain: 'localhost:3000',  // Or use the appropriate backend domain
  };
  