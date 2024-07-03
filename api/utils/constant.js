export const DB_NAME = "socialdb";
export const options = {
    httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
    secure: true,     // Ensures the cookie is sent over HTTPS
    sameSite: 'Strict', // Prevents the cookie from being sent with cross-site requests
    maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expiry set to 1 week (optional)
};
