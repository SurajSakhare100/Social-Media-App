export const DB_NAME = "socialdb";
export const options = {
    httpOnly: true, 
    secure: true, 
    sameSite: "Strict",
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie will expire in 3 days
    path: "/", // Ensure it's accessible across the entire app
    domain: "dev-net-backend.onrender.com", 
};

