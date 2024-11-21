import express from "express";
import {register, login, logout, updateProfile, followUser, unfollowUser} from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer2.js";


const router = express.Router();

router.route("/signup").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/:id").put(singleUpload, updateProfile);
router.route('follow').post(followUser);
router.route('/unfollow').post(unfollowUser);

export default router