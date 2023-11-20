import multer from "multer";
import { createUploadthing } from "uploadthing/express";

// Multer setup for memory storage
const upload = multer();

// Create an instance of Uploadthing
const f = createUploadthing();

// Middleware to upload file to Uploadthing
const uploadRouter = {
  videoAndImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
    video: {
      maxFileSize: "16MB",
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
};

export { upload, uploadRouter };
