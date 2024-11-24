import multer from "multer";
import path from "path";
import fs from "fs";

// Multer storage configuration
const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    // Extract userId and projectId from the request body or parameters
    const { userId, projectId } = req.body; // Assuming these are sent in the request body
    console.log("User ID:", userId);
    console.log("Project ID:", projectId);
    if (!userId || !projectId) {
      return cb(new Error("User ID and Project ID are required"));
    }

    // Construct the dynamic upload path
    const uploadPath = path.join("uploads", userId, projectId);

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // Use the dynamic path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer configuration
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    console.log("File MIME type:", file.mimetype); // Log the MIME type
    const allowedTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "image/png",
      "image/jpeg",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
}).fields([
  { name: "frontendFile", maxCount: 7 },
  { name: "backendFile", maxCount: 7 },
  { name: "thumbnail", maxCount: 5 },
]);
