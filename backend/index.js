import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/project.route.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

dotenv.config();

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up CORS
const corsOption = {
  origin: ["https://projectshowcase.onrender.com", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOption));

// Serve static files from the uploads folder
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/project", projectRoute);

// Specific route for user files with CORS applied
app.get('/uploads/:userId/:projectId/*', cors(corsOption), (req, res) => {
  const { userId, projectId } = req.params;
  const filePath = req.params[0]; // Captures everything after /uploads/:userId/:projectId/

  // Construct the absolute path
  const absolutePath = path.join(__dirname, 'uploads', userId, projectId, filePath);

  if (!fs.existsSync(absolutePath)) {
      console.error(`File not found: ${absolutePath}`);
      return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(absolutePath);
});


const port = process.env.PORT || 4000;

const server = createServer(app);
server.setTimeout(500000); // Adjust server timeout directly


server.listen(port, () => {
  connectDB();
  console.log(`Server is listening on port ${port}`);
});
