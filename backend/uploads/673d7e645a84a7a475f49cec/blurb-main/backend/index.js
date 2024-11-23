import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notification.route.js";
import isAuthenticated from "./middlewares/isAuthenticated.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost:5173', 'https://blurb-azo3.onrender.com'], // Allow frontend origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/notification", notificationRoute);

const port = process.env.PORT || 4000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://blurb-azo3.onrender.com'],
        methods: ['GET', 'POST'],
    },
});

// Socket.IO Logic
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Example event
    socket.on("sendNotification", (data) => {
        console.log("Notification data:", data);
        // Emit notification to all connected clients
        io.emit("receiveNotification", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Start the server
server.listen(port, () => {
    connectDB();
    console.log(`Server is listening at port ${port}`);
});
