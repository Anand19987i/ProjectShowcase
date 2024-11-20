import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js"; 
import AdmZip from 'adm-zip'; // Import adm-zip

export const createProject = async (req, res) => {
  try {
    const { title, description, projectType, projectGenre, userId } = req.body;

    if (!title || !description || !projectType || !projectGenre || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const uploads = {};

    // Handle frontendFile (check if it's a zip and unzip it if necessary)
    if (req.files?.frontendFile) {
      const frontendFile = req.files.frontendFile[0];
      if (frontendFile.mimetype === 'application/zip') {
        const zip = new AdmZip(frontendFile.tempFilePath);  // Read the zip file
        const extractedPath = `uploads/${userId}/frontend/`;  // Destination path for extracted files
        zip.extractAllTo(extractedPath, true);  // Extract the zip file
        uploads.frontendFile = extractedPath;  // Set the extracted folder path to upload object
      } else {
        const frontendFileUri = getDataUri(frontendFile);
        const frontendFileUpload = await cloudinary.uploader.upload(frontendFileUri, {
          resource_type: "raw",
        });
        uploads.frontendFile = frontendFileUpload.secure_url;
      }
    }

    // Handle backendFile
    if (req.files?.backendFile) {
      const backendFileUri = getDataUri(req.files.backendFile[0]);
      const backendFileUpload = await cloudinary.uploader.upload(backendFileUri, {
        resource_type: "raw",
      });
      uploads.backendFile = backendFileUpload.secure_url;
    }

    // Handle thumbnails
    if (req.files?.thumbnail) {
      uploads.thumbnails = [];
      for (let i = 0; i < req.files.thumbnail.length; i++) {
        const thumbnailUri = getDataUri(req.files.thumbnail[i]);
        const thumbnailUpload = await cloudinary.uploader.upload(thumbnailUri, {
          resource_type: "image",
        });
        uploads.thumbnails.push(thumbnailUpload.secure_url);
      }
    }

    const project = new Project({
      title,
      description,
      projectType,
      projectGenre,
      user: userId,
      frontendFile: uploads.frontendFile || null,
      backendFile: uploads.backendFile || null,
      thumbnails: uploads.thumbnails || [],
    });

    await project.save();

    res.status(201).json({
      message: "Project created successfully!",
      project,
    });
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get All Projects Controller
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("user", "username email avatar"); // Populate user details if needed
    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Controller for fetching a project by ID
// Example of getProjectById controller function
export const getProjectById = async (req, res) => {
  const { projectId } = req.params; // Get projectId from URL params
  try {
    const project = await Project.findById(projectId).populate('user', "name username email avatar"); // Assuming you are using Mongoose
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};




export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const projects = await Project.find({ user: userId }).populate("user", "name avatar email thumbnails");
    
    if (!projects) {
      return res.status(404).json({ success: false, message: "Projects not found" });
    }

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, projectType } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.projectType = projectType || project.projectType;
        project.updatedAt = Date.now();

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        await project.remove();

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const searchedQuery = async (req, res) => {
  const { projectGenre } = req.query;
  try {
    console.log("Received Query:", projectGenre);
    const filter = projectGenre
    ? {
        $or: [
          { projectGenre: { $regex: projectGenre, $options: "i" } },
          { title: { $regex: projectGenre, $options: "i" } },
          { description: { $regex: projectGenre, $options: "i" } },
        ],
      }
    : {};
  
    console.log("Filter Applied:", filter);
    const projects = await Project.find(filter).populate("user", "username email avatar");
    console.log("Projects Found:", projects);
    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No projects found for the given genre.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Projects searched successfully.",
      projects,
    });
  } catch (error) {
    console.error("Error searching projects:", error);
    res.status(500).json({ message: "Error fetching search projects." });
  }
};
