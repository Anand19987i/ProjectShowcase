import express from "express";
import { upload } from "../middlewares/multer.js";
import { createProject, deleteProject, getAllProjects, getProjectById, getUserProjects, updateProject, searchedQuery, userProfile, addLike, removeLike, addFollower, removeFollower, views } from "../controllers/project.controller.js";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";
import { exec } from 'child_process';
import util from 'util';

const mkdtempAsync = util.promisify(fs.mkdtemp);
const writeFileAsync = util.promisify(fs.writeFile);
const execAsync = util.promisify(exec);
const rmAsync = util.promisify(fs.rm);

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
router.route('/unlike/:projectId').delete(removeLike);
router.route('/view/:projectId').put(views);

router.get('/:userId/:projectId/files', (req, res) => {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const extractedDir = path.join('uploads', userId, projectId);


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

const executeCode = async (language, code) => {
    const tempDir = await mkdtempAsync(path.join(process.cwd(), 'temp-'));
    let command, filename;
  
    try {
      switch (language) {
        case 'python':
          filename = path.join(tempDir, 'main.py');
          await writeFileAsync(filename, code);
          command = `python3 ${filename}`;
          break;
        case 'java':
          filename = path.join(tempDir, 'Main.java');
          await writeFileAsync(filename, code);
          command = `javac ${filename} && java -classpath ${tempDir} Main`;
          break;
        case 'cpp':
          filename = path.join(tempDir, 'main.cpp');
          const exePath = path.join(tempDir, 'main');
          await writeFileAsync(filename, code);
          command = `g++ ${filename} -o ${exePath} && ${exePath}`;
          break;
        default:
          throw new Error('Unsupported language');
      }
  
      const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
      return { output: stdout || stderr };
    } finally {
      await rmAsync(tempDir, { recursive: true, force: true });
    }
  };
  
  router.post('/execute', async (req, res) => {
    const { code, language } = req.body;
  
    if (!code || !language) {
      return res.status(400).json({ error: 'Code or language is missing' });
    }
  
    try {
      const result = await executeCode(language, code);
      res.json(result);
    } catch (error) {
      console.error('Error executing code:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  export default router;
  