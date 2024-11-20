import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useParams } from 'react-router-dom';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setSingleProject, setLoading, setError } from '@/redux/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectDetail = () => {
  const { projectId } = useParams(); // Get projectId from URL params
  const dispatch = useDispatch();

  // Accessing the state from the Redux store
  const { singleProject, loading, error } = useSelector(store => store.project);

  // State for managing the current thumbnail index
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  // Fetch project details when component mounts
  useEffect(() => {
    const fetchProjectDetails = async () => {
      dispatch(setLoading(true)); // Start loading

      try {
        console.log('Project ID from params:', projectId);
        const response = await axios(`${PROJECT_API_END_POINT}/detail/${projectId}`, { withCredentials: true });

        if (response.data.success) {
          dispatch(setSingleProject(response.data.project)); // Set the project in Redux
        } else {
          dispatch(setError('Project not found'));
        }
      } catch (error) {
        dispatch(setError('Error fetching project details'));
        console.error('Error fetching project details:', error);
      } finally {
        dispatch(setLoading(false)); // End loading
      }
    };

    fetchProjectDetails();
  }, [projectId, dispatch]); // Dependency array to refetch if projectId changes

  // Conditional rendering based on loading and error state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Check if singleProject and its properties are available
  if (!singleProject) {
    return <div>No project data available</div>;
  }

  // Function to go to the next thumbnail
  const nextThumbnail = () => {
    if (currentThumbnailIndex < singleProject.thumbnails.length - 1) {
      setCurrentThumbnailIndex(currentThumbnailIndex + 1);
    }
  };

  // Function to go to the previous thumbnail
  const prevThumbnail = () => {
    if (currentThumbnailIndex > 0) {
      setCurrentThumbnailIndex(currentThumbnailIndex - 1);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col p-5 mx-auto max-w-screen-lg">
        {/* Avatar and Username */}
        {singleProject.user ? (
          <div className="flex gap-3 mb-5 items-center">
            <Avatar className="cursor-pointer w-14 h-14">
              <AvatarImage src={singleProject.user.avatar} alt="User Avatar" />
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{singleProject.user.username}</h2>
              <p className="text-sm text-gray-500">{singleProject.user.email}</p>
            </div>
          </div>
        ) : (
          <p>No user information available</p>
        )}

        {/* Thumbnails */}
        <div className="mt-5 w-full border border-gray-300 relative">
          <div className="flex justify-center">
            {/* Display current thumbnail */}
            {singleProject.thumbnails && singleProject.thumbnails.length > 0 && (
              <img
                src={singleProject.thumbnails[currentThumbnailIndex]}
                alt={`Thumbnail ${currentThumbnailIndex + 1}`}
                className="w-full h-auto rounded-md"
              />
            )}
          </div>

          {/* Left Arrow */}
          {singleProject.thumbnails && singleProject.thumbnails.length > 1 && (
            <button
              onClick={prevThumbnail}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 opacity-65 text-white p-2 rounded-full"
              disabled={currentThumbnailIndex === 0}
            >
              <ChevronLeft className="w-2 h-2" />
            </button>
          )}

          {/* Right Arrow */}
          {singleProject.thumbnails && singleProject.thumbnails.length > 1 && (
            <button
              onClick={nextThumbnail}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 opacity-65 text-white p-2 rounded-full "
              disabled={currentThumbnailIndex === singleProject.thumbnails.length - 1}
            >
              <ChevronRight className="w-2 h-2" />
            </button>
          )}
        </div>

        {/* Project Title and Description */}
        <div className="mt-5">
          <h3 className="text-2xl font-bold">{singleProject.title}</h3>
          <p className="text-lg mt-3 text-gray-700">{singleProject.description}</p>
        </div>

        {/* Files */}
        <div className=" mt-5">
        {singleProject.frontendFile && (
            <div className="mt-5">
              <h4 className="text-xl font-semibold">Frontend File</h4>
              <a
                href={singleProject.frontendFile}
                className="text-blue-500 hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Frontend File
              </a>
            </div>
          )}

          {singleProject.backendFile && (
            <div className=" mt-5">
              <h4 className="text-xl font-semibold">Backend File</h4>
              <a
                href={singleProject.backendFile}
                className="text-blue-500 hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Backend File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
