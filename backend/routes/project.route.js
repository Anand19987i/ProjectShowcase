import express from "express";
import {  upload } from "../middlewares/multer.js";
import { createProject, deleteProject, getAllProjects, getProjectById, getUserProjects, searchedQuery, updateProject } from "../controllers/project.controller.js";


const router = express.Router();

router.route("/upload/project").post(upload, createProject);
router.route("/delete/project").post(deleteProject);
router.route("/projects").get(getAllProjects);
router.route("/profile/:userId").post(getUserProjects);
router.route("/detail/:projectId").get(getProjectById);
router.route("/update/project").post(updateProject);
router.route("/projects/search").get(searchedQuery);


export default router