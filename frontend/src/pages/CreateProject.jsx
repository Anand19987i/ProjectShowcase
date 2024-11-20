import React, { useState } from "react";
import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectGenre, setProjectGenre] = useState("ecommerce"); // New state for genre
  const [projectType, setProjectType] = useState("frontend");
  const [frontendFile, setFrontendFile] = useState(null);
  const [backendFile, setBackendFile] = useState(null);
  const [thumbnails, setThumbnails] = useState([]); // Updated to handle multiple images
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const genreOptions = ["Ecommerce", "Dashboard", "Portfolio", "Blog", "Social Media"]; // Genre options

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("projectGenre", projectGenre); // Include genre in form data
    formData.append("projectType", projectType);
    formData.append("userId", user?.id); // Add userId here

    if (frontendFile) formData.append("frontendFile", frontendFile);
    if (backendFile) formData.append("backendFile", backendFile);
    if (thumbnails.length > 0) {
      thumbnails.forEach((file) => {
        formData.append("thumbnail", file); // Add each thumbnail
      });
    }

    // Log formData to ensure it's populated correctly
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      setLoading(true);
      setSuccessMessage(null);
      setError(null);

      const response = await axios.post(
        `${PROJECT_API_END_POINT}/upload/project`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccessMessage("Project created successfully!");
      navigate("/");

      // Reset the form fields after successful submission
      setTitle("");
      setDescription("");
      setProjectGenre("ecommerce");
      setProjectType("frontend");
      setFrontendFile(null);
      setBackendFile(null);
      setThumbnails([]);
    } catch (err) {
      setError("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setThumbnails(files); // Update the thumbnails state
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Upload your Project on <span className="text-pink-600">Dribbble</span>
        </h2>

        {successMessage && (
          <div className="bg-green-200 text-green-800 p-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Project Title"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Project Description"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Project Genre</label>
            <select
              value={projectGenre}
              onChange={(e) => setProjectGenre(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {genreOptions.map((genre) => (
                <option key={genre} value={genre.toLowerCase()}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Project Type</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="both">Both</option>
            </select>
          </div>
          {["frontend", "both"].includes(projectType) && (
            <div>
              <label className="block mb-2 text-sm font-medium">Frontend File</label>
              <input
                type="file"
                onChange={(e) => setFrontendFile(e.target.files[0])}
                className="w-full"
                accept=".zip,.rar"
              />
            </div>
          )}
          {["backend", "both"].includes(projectType) && (
            <div>
              <label className="block mb-2 text-sm font-medium">Backend File</label>
              <input
                type="file"
                onChange={(e) => setBackendFile(e.target.files[0])}
                className="w-full"
                accept=".zip,.rar"
              />
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm font-medium">Thumbnails</label>
            <input
              type="file"
              onChange={handleThumbnailChange}
              className="w-full"
              accept="image/*"
              multiple // Allow multiple files
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Project"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
