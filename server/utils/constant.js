export const DB_NAME = "socialdb";
export const options = {
    httpOnly: true, 
    secure: true, // Make sure this is true for production
    sameSite: "None", // This allows cookies to be sent in cross-site contexts
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie will expire in 3 days
    path: "/", // Ensure it's accessible across the entire app
    domain: "dev-net-backend.onrender.com", // Correct format
};


