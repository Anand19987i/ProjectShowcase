import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Link, useParams } from 'react-router-dom';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setSingleProject, setLoading, setError } from '@/redux/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ProjectFiles from './ProjectFiles';

const ProjectDetail = () => {
  const { projectId } = useParams(); 
  const dispatch = useDispatch();
  const { singleProject, loading, error } = useSelector(store => store.project);

  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      dispatch(setLoading(true));

      try {
        const response = await axios(`${PROJECT_API_END_POINT}/detail/${projectId}`, { withCredentials: true });

        if (response.data.success) {
          dispatch(setSingleProject(response.data.project));
        } else {
          dispatch(setError('Project not found'));
        }
      } catch (error) {
        dispatch(setError('Error fetching project details'));
        console.error('Error fetching project details:', error);
      } finally {
        dispatch(setLoading(false)); 
      }
    };

    fetchProjectDetails();
  }, [projectId, dispatch]);

  const Spinner = () => (
    <div className="w-5 h-5 border border-t-transparent border-pink-500 border-solid rounded-full animate-spin my-60"></div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!singleProject) {
    return <div>No project data available</div>;
  }

  const nextThumbnail = () => {
    if (currentThumbnailIndex < singleProject.thumbnails.length - 1) {
      setCurrentThumbnailIndex(currentThumbnailIndex + 1);
    }
  };

  const prevThumbnail = () => {
    if (currentThumbnailIndex > 0) {
      setCurrentThumbnailIndex(currentThumbnailIndex - 1);
    }
  };
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://your-backend-url.com' : 'http://localhost:3000';

  return (
    <div>
      <Navbar />
      <div className="flex flex-col p-5 mx-auto max-w-screen-lg">
        {singleProject.user ? (
          <Link to={`/q/profile/${singleProject.user._id}`}>
            <div className="flex gap-3 mb-5 items-center">
              <Avatar className="cursor-pointer w-14 h-14">
                <AvatarImage src={singleProject.user.avatar} alt="User Avatar" />
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{singleProject.user.username}</h2>
                <p className="text-sm text-gray-500">{singleProject.user.email}</p>
              </div>
            </div>
          </Link>
        ) : (
          <p>No user information available</p>
        )}

        <div className="mt-5 w-full border border-gray-300 relative">
          <div className="flex justify-center">
            {singleProject.thumbnails && singleProject.thumbnails.length > 0 && (
              <img
                src={singleProject.thumbnails[currentThumbnailIndex]}
                alt={`Thumbnail ${currentThumbnailIndex + 1}`}
                className="w-full h-auto rounded-md"
              />
            )}
          </div>

          {singleProject.thumbnails && singleProject.thumbnails.length > 1 && (
            <button
              onClick={prevThumbnail}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 opacity-65 text-white p-2 rounded-full"
              disabled={currentThumbnailIndex === 0}
            >
              <ChevronLeft className="w-2 h-2" />
            </button>
          )}

          {singleProject.thumbnails && singleProject.thumbnails.length > 1 && (
            <button
              onClick={nextThumbnail}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 opacity-65 text-white p-2 rounded-full"
              disabled={currentThumbnailIndex === singleProject.thumbnails.length - 1}
            >
              <ChevronRight className="w-2 h-2" />
            </button>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-2xl font-bold">{singleProject.title}</h3>
          <p className="text-lg mt-3 text-gray-700">{singleProject.description}</p>
        </div>
        <ProjectFiles userId={singleProject?.user?._id}/>
        </div>
        
    </div>
  );
};

export default ProjectDetail;
