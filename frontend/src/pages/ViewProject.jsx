import React from 'react';
import ProjectCard from './ProjectCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useGetAllProjects from '@/hooks/useGetAllProjects';

const ViewProject = () => {
  // Fetch all projects on component mount
  useGetAllProjects();

  const { projects } = useSelector(store => store.project);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
      <div className="flex justify-center items-center flex-wrap gap-7 p-5">
        {/* Display message when no projects are available */}
        {projects.length <= 0 ? (
          <p className="text-xl font-medium text-center w-full">No projects available</p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project?._id} project={project} />
          ))
        )}
      </div>
  );
};

export default ViewProject;
