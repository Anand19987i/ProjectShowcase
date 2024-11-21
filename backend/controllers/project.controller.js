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

    if (req.files?.backendFile) {
      const backendFileUri = getDataUri(req.files.backendFile[0]);
      const backendFileUpload = await cloudinary.uploader.upload(backendFileUri, {
        resource_type: "raw",
      });
      uploads.backendFile = backendFileUpload.secure_url;
    }

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
export const getProjectById = async (req, res) => {
  const { projectId } = req.params; 
  try {
    const project = await Project.findById(projectId).populate('user', "name username email avatar user");
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
    const { title, description, projectType, projectGenre } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const uploads = {};
    if (req.files?.frontendFile) {
      const frontendFile = req.files.frontendFile[0];
      if (frontendFile.mimetype === 'application/zip') {
        const zip = new AdmZip(frontendFile.tempFilePath);
        const extractedPath = `uploads/${project.user}/frontend/`;
        zip.extractAllTo(extractedPath, true);
        uploads.frontendFile = extractedPath;
      } else {
        const frontendFileUri = getDataUri(frontendFile);
        const frontendFileUpload = await cloudinary.uploader.upload(frontendFileUri, {
          resource_type: "raw",
        });
        uploads.frontendFile = frontendFileUpload.secure_url;
      }
    }
    if (req.files?.backendFile) {
      const backendFileUri = getDataUri(req.files.backendFile[0]);
      const backendFileUpload = await cloudinary.uploader.upload(backendFileUri, {
        resource_type: "raw",
      });
      uploads.backendFile = backendFileUpload.secure_url;
    }

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

    project.title = title || project.title;
    project.description = description || project.description;
    project.projectType = projectType || project.projectType;
    project.projectGenre = projectGenre || project.projectGenre;

    if (uploads.frontendFile) {
      project.frontendFile = uploads.frontendFile;
    }
    if (uploads.backendFile) {
      project.backendFile = uploads.backendFile;
    }
    if (uploads.thumbnails?.length) {
      project.thumbnails = uploads.thumbnails;
    }

    project.updatedAt = Date.now();

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Error updating project:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


export const deleteProject = async (req, res) => {
  const { id } = req.params; 
  try {
    const deletedProject = await Project.findByIdAndDelete(id); 

    if (!deletedProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, project: deletedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
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

export const userProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const projects = await Project.find({ user: userId }).populate("user", "name avatar email username");

    return res.status(200).json({
      success: true,
      user,
      projects
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


export const addLike = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this project" });
    }

    project.likes.push(userId);
    await project.save();

    res.status(200).json({ message: "Like added", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeLike = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const index = project.likes.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ message: "You haven't liked this project yet" });
    }
    project.likes.splice(index, 1);
    await project.save();

    res.status(200).json({ message: "Like removed", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addFollower = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.followers.includes(userId)) {
      return res.status(400).json({ message: "You are already following this project" });
    }

    project.followers.push(userId);
    await project.save();

    res.status(200).json({ message: "Followed project", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeFollower = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const index = project.followers.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ message: "You are not following this project" });
    }

    project.followers.splice(index, 1);
    await project.save();

    res.status(200).json({ message: "Unfollowed project", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('likes', 'name')
      .populate('followers', 'name');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      project,
      likeCount: project.likes.length,
      followerCount: project.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const views = async (req, res) => {
  const { projectId } = req.params; 
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }
    project.views += 1;
    await project.save();

    res.status(200).json({
      message: 'View count updated',
      views: project.views,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
