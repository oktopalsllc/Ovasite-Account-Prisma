import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import stream from "stream";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file
const uploadFile = async (file) => {
  try {
    const uploadOptions = {
      resource_type: "image",
    };

    if (file.buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } else {
      const result = await cloudinary.uploader.upload(file.path, uploadOptions);
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
const updateFile = async (file, oldPublicId) => {
  try {
    // Upload the new file
    const uploadOptions = {
      resource_type: "image",
      ...(file.buffer && { resource_type: "auto" }), // For buffer upload
    };

    let newFileResult;
    if (file.buffer) {
      // Handle buffer upload
      newFileResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } else {
      // Handle file path upload
      newFileResult = await cloudinary.uploader.upload(
        file.path,
        uploadOptions
      );
    }

    // Delete the old file if it exists
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    return newFileResult.secure_url;
  } catch (error) {
    console.error("Error in updateFile:", error);
    throw error;
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

// Helper function to extract publicId from a Cloudinary URL

const getPublicIdFromUrl = (url) => {
  if (!url) return { publicId: null, folderName: null };

  // Splitting the URL into parts
  const urlParts = url.split("/");

  const uploadIndex = urlParts.indexOf("upload");
  const folderName = urlParts.slice(uploadIndex + 1, -1).join("/");

  const fileName = urlParts[urlParts.length - 1];
  const [publicId] = fileName.split(".");
  console.log("🚀 ~ file: index.js:28 ~ newStuff ~ publicId:", publicId);

  console.log("🚀 ~ file: index.js:31 ~ newStuff ~ folderName:", folderName);
  return { publicId, folderName };
};

export {
  deleteFile,
  fetchFileDetails,
  getPublicIdFromUrl,
  listFiles,
  updateFile,
  uploadFile,
};
