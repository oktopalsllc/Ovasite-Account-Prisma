import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import stream from "stream"
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file
const uploadFile = async (file) => {
  try {
    // If file is stored in memory by multer, use buffer
    if (file.buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        // Pipe the buffer into Cloudinary's upload stream
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } else {
      // If file is stored as a file in the filesystem, use the file path
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to Cloudinary:", error.message);
  }
};

// Function to delete a file
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result; // Returns the result of the deletion
  } catch (error) {
    throw new Error("Error deleting file from Cloudinary:", error.message);
  }
};

// Function to update a file
const updateFile = async (file, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: publicId,
      overwrite: true,
    });
    return result.url; // Returns the new file URL
  } catch (error) {
    throw new Error("Error updating file on Cloudinary:", error.message);
  }
};

// Function to fetch file details
const fetchFileDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result; // Returns the file details
  } catch (error) {
    throw new Error(
      "Error fetching file details from Cloudinary:",
      error.message
    );
  }
};

// Function to list files
const listFiles = async (options = {}) => {
  try {
    const result = await cloudinary.api.resources(options);
    return result.resources; // Returns an array of file details
  } catch (error) {
    throw new Error("Error listing files from Cloudinary:", error.message);
  }
};

export { deleteFile, fetchFileDetails, listFiles, updateFile, uploadFile };
