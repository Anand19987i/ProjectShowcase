import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/project.route.js";
dotenv.config({});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOption));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/project", projectRoute);

const port = process.env.PORT || 4000;

const server = createServer(app);

server.listen(port, () => {
    connectDB();
    console.log(`Server is listening at port ${port}`);
});