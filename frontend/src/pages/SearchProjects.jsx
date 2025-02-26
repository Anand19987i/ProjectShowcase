import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import Navbar from "./Navbar";

const SearchProjects = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      fetchProjects();
    }
  }, [searchQuery]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${PROJECT_API_END_POINT}/projects/search?projectGenre=${searchQuery}`
      );
      setProjects(response.data.projects || []);
    } catch (err) {
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const Spinner = () => (
    <div className="w-5 h-5 border border-t-transparent border-pink-500 border-solid rounded-full animate-spin my-60"></div>
  );
  return (
    <>
    <Navbar/>
    <div className="p-6  mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Results for <span className="text-pink-600">{searchQuery}</span></h2>
      {loading && <div className="flex justify-center items-center">
        <Spinner />
      </div>}
      {/* {error && <p className="text-red-600">{error}</p>} */}
      <div className="flex flex-wrap">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          !loading && <p>No projects found for the given genre.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default SearchProjects;
