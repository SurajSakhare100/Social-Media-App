import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) return null;

      // Generate a unique filename by appending a timestamp
      const uniqueFilename = new Date().toISOString() + '_' + Math.random().toString(36).substring(7);
      const cloudinaryPath = `${uniqueFilename}`;

      // Upload the file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",
          public_id: cloudinaryPath  // Set the Cloudinary path using the unique filename
      });

      // Remove the locally saved temporary file after successful upload
      fs.unlinkSync(localFilePath);

      return response;
  } catch (error) {
      // Handle upload failure or errors
      console.error("Error uploading file to Cloudinary:", error);

      // Remove the locally saved temporary file if the upload operation failed
      if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
      }

      return null;
  }
};

const getImageFromCloudinary = async (publicId) => {
    try {
      // Use the url method to generate the URL for the image
      const imageUrl =cloudinary.url(publicId);

      return imageUrl;
    } catch (error) {
      console.error('Error fetching image from Cloudinary:', error);
      return null;
    }
  };


export {uploadOnCloudinary,getImageFromCloudinary}