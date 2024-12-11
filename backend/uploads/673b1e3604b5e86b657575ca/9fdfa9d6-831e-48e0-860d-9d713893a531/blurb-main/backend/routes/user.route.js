import express from "express";
import { getProfile, googleLogin, login, logout, register, search, updateProfile } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/google-login").post(singleUpload, googleLogin);
router.route("/profile/:id").put(singleUpload, updateProfile);
router.route("/search").get(search);
router.route("/search/profile/:id").get(getProfile);

export default router