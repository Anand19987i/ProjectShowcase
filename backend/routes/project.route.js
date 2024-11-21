import express from "express";
import {  upload } from "../middlewares/multer.js";
import { addFollower, addLike, createProject, deleteProject, getAllProjects, getProjectById, getUserProjects, removeFollower, removeLike, searchedQuery, updateProject, userProfile, views } from "../controllers/project.controller.js";


const router = express.Router();

router.route("/upload/project").post(upload, createProject);
router.route("/delete/project/:id").delete(deleteProject);
router.route("/projects").get(getAllProjects);
router.route("/profile/:userId").post(getUserProjects);
router.route("/detail/:projectId").get(getProjectById);
router.route("/update/project/:id").put(upload, updateProject);
router.route("/projects/search").get(searchedQuery);
router.route("/q/profile/:userId").get(userProfile);
router.route('/like/:projectId').post(addLike);
router.route('/like/:projectId').delete(removeLike);
router.route('/follow/:projectId').post(addFollower);
router.route('/follow/:projectId').delete(removeFollower);
router.route('/view/:projectId').put(views);


export default router