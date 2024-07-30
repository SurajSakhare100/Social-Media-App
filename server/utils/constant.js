export const DB_NAME = "socialdb";
export const options = {
    httpOnly: true, // Cookie cannot be accessed via client-side scripts
    secure: true, // Send cookie only over HTTPS in production
    sameSite: 'strict'
};
