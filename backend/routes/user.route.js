import express from "express";
import {register, login, logout, updateProfile} from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer2.js";


const router = express.Router();

router.route("/signup").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/:id").put(singleUpload, updateProfile);

export default router