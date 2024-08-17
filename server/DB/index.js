import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../utils/constant.js";

dotenv.config();
const connectDB = async () => {
    try {
        const dbURI = `${process.env.MONGODB_URL}/${DB_NAME}?ssl=true`;

        console.log(`Connecting to MongoDB at ${dbURI}`);
        const connectionInstance = await mongoose.connect(dbURI, {
          
            tls: true,
            tlsInsecure: true, // Disable certificate validation (not recommended in production)
        });
    } catch (error) {
        console.error("MongoDB connection FAILED", error);
        process.exit(1);
    }
}

export default connectDB;
