import express from "express";
import { upload } from "../middlewares/multer.js";
import { createProject, deleteProject, getAllProjects, getProjectById, getUserProjects, updateProject, searchedQuery, userProfile, addLike, removeLike, addFollower, removeFollower, views } from "../controllers/project.controller.js";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";

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

router.get('/:userId/:projectId/files', (req, res) => {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const extractedDir = path.join('uploads', userId, projectId);
    
    console.log(`Fetching files from: ${extractedDir}`);
    
    if (!fs.existsSync(extractedDir)) {
        console.error(`Directory not found: ${extractedDir}`);
        return res.status(404).json({ error: 'Directory not found' });
    }
    
    const readDirectory = (dirPath) => {
        const items = fs.readdirSync(dirPath);
        const files = [];
        
        if (items.length === 0) {
            return []; // Return empty array for empty directories
        }

        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const stats = fs.statSync(fullPath);
    
            if (stats.isDirectory()) {
                files.push({
                    type: 'folder',
                    name: item,
                    contents: readDirectory(fullPath),
                });
            } else {
                files.push({ type: 'file', name: item });
            }
        });
    
        return files;
    };

    try {
        const files = readDirectory(extractedDir);
        if (files.length === 0) {
            console.log("Directory is empty, no files found.");
            return res.status(404).json({ message: 'No files found in the directory' });
        }
        res.json({ files });
    } catch (err) {
        console.error("Error reading directory:", err);
        res.status(500).json({ error: 'Error reading directory' });
    }
});


export default router;
