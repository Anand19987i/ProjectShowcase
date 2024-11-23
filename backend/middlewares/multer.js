import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer disk storage for better file handling
const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId; // Get userId from request body
    const uploadPath = path.join(__dirname, '..', 'uploads', userId); // Correct the path

    // Log paths for debugging
    console.log("Uploading to path:", uploadPath);

    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath); // Set the upload path
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Preserve original filename
  },
});

// Create the multer upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/zip", // ZIP file
      "application/x-zip-compressed",
      "image/png",
      "image/jpeg",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true); // Accept the file
  },
}).fields([
  { name: "frontendFile", maxCount: 7 },
  { name: "backendFile", maxCount: 7 },
  { name: "thumbnail", maxCount: 5 },
]);


