import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../utils/constant.js";

dotenv.config();
const connectDB = async () => {
    try {
        const dbURI = `${process.env.MONGODB_URL}/${DB_NAME}`;
        const connectionInstance = await mongoose.connect(dbURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Additional options for production
            serverSelectionTimeoutMS: 5000, // Adjust as needed
            socketTimeoutMS: 45000, // Adjust as needed
        });
        // console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED", error);
        process.exit(1);
    }
}

export default connectDB;
