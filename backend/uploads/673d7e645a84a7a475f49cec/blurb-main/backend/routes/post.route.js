import express from "express";
import { addComment, createPost, getAllPost, getCommentsForPost, getUserPosts, toggleLike } from "../controllers/post.controller.js";
import { singleUpload } from "../middlewares/multer1.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/feed").post(singleUpload, createPost);
router.route("/v/feed").get(getAllPost);
router.route("/posts/:postId/like").post(isAuthenticated, toggleLike);
router.route("/posts/:postId/comment").post(isAuthenticated, addComment);
router.route("/posts/:postId/comments").get(getCommentsForPost);  // Fetch comments for a post
router.route("/posts/user/:userId").get(getUserPosts);

export default router;
