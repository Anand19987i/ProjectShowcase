import React, { useState, useEffect } from "react";
import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProject = () => {
  const { singleProject } = useSelector(store => store.project);
  const { projectId } = useParams();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState(singleProject?.title || "");
  const [description, setDescription] = useState(singleProject?.description || "");
  const [projectGenre, setProjectGenre] = useState(singleProject?.projectGenre || "ecommerce");
  const [projectType, setProjectType] = useState(singleProject?.projectType || "frontend");
  const [frontendFile, setFrontendFile] = useState(null);
  const [backendFile, setBackendFile] = useState(null);
  const [thumbnails, setThumbnails] = useState(singleProject?.thumbnails || []); 
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const genreOptions = ["Ecommerce", "Dashboard", "Portfolio", "Blog","Web Application", "Mobile Application", "AI/ML", "CLoud Computing", "Social Media"];

  useEffect(() => {
    if (singleProject?.frontendFile) {
      setFrontendFile(singleProject.frontendFile);
    }
    if (singleProject?.backendFile) {
      setBackendFile(singleProject.backendFile);
    }
  }, [singleProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("projectGenre", projectGenre);
    formData.append("projectType", projectType);
    formData.append("userId", user?.id);

    if (frontendFile) formData.append("frontendFile", frontendFile);
    if (backendFile) formData.append("backendFile", backendFile);
    if (thumbnails.length > 0) {
      thumbnails.forEach((file) => {
        formData.append("thumbnail", file);
      });
    }

    try {
      setLoading(true);
      setSuccessMessage(null);
      setError(null);

      const response = await axios.put(
        `${PROJECT_API_END_POINT}/update/project/${projectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccessMessage("Project updated successfully!");
      navigate(`/profile/${user.id}`);

      setTitle("");
      setDescription("");
      setProjectGenre("ecommerce");
      setProjectType("frontend");
      setFrontendFile(null);
      setBackendFile(null);
      setThumbnails([]);
    } catch (err) {
      setError("Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const files = Array.from(e.target.files); 
    setThumbnails(files);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Update your Project on <span className="text-pink-600">Dribbble</span>
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
              multiple
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Project"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProject;
