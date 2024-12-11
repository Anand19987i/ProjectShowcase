import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaHeart } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const { user } = useSelector((store) => store.auth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(project.views || 0);

  useEffect(() => {
    if (project.likes && user) {
      setLiked(project.likes.includes(user.id));
      setLikesCount(project.likes.length);
    }
  }, [project.likes, user]);


  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < project?.thumbnails.length - 1 ? prevIndex + 1 : 0
    );
  };


  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : project?.thumbnails.length - 1
    );
  };

  const handleLike = async () => {
    if (!user) {
      console.error('User not logged in.');
      return;
    }
  
    // Optimistic UI update
    setLiked(true);
    setLikesCount((prevCount) => prevCount + 1);
  
    try {
      await axios.post(
        `${PROJECT_API_END_POINT}/like/${project._id}`,
        { userId: user?.id },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error liking project:", error.response?.data || error.message);
      // Revert state changes on error
      setLiked(false);
      setLikesCount((prevCount) => prevCount - 1);
    }
  };
  
  const handleUnlike = async () => {
    if (!user) {
      console.error('User not logged in.');
      return;
    }
  
    // Optimistic UI update
    setLiked(false);
    setLikesCount((prevCount) => prevCount - 1);
  
    try {
      await axios.delete(
        `${PROJECT_API_END_POINT}/unlike/${project._id}`,
        {
          data: { userId: user.id },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error unliking project:", error.response?.data || error.message);
      // Revert state changes on error
      setLiked(true);
      setLikesCount((prevCount) => prevCount + 1);
    }
  };
  
  useEffect(() => {
    if (project.likes && user) {
      setLiked(project.likes.includes(user.id));
      setLikesCount(project.likes.length);
    }
  }, [project.likes, user]);
  
  const handleViewDetails = async () => {
    let viewedProjects = JSON.parse(sessionStorage.getItem('viewedProjects')) || [];

    if (!viewedProjects.includes(project._id)) {
      try {
        const response = await axios.put(
          `${PROJECT_API_END_POINT}/view/${project._id}`,
          {},
          { withCredentials: true }
        );

        setViewsCount(response.data.views);

        viewedProjects.push(project._id);
        sessionStorage.setItem('viewedProjects', JSON.stringify(viewedProjects));
        console.log('View count incremented for project:', project._id);
      } catch (error) {
        console.error('Error updating view count:', error.response?.data || error.message);
      }
    } else {
      console.log('This project has already been viewed in this session');
    }
  };

  const removeProjectFromSessionStorage = () => {
    let viewedProjects = JSON.parse(sessionStorage.getItem('viewedProjects')) || [];
    viewedProjects = viewedProjects.filter(id => id !== project._id);
    sessionStorage.setItem('viewedProjects', JSON.stringify(viewedProjects));
    console.log(`Project ${project._id} removed from sessionStorage`);
  };
  const handleLogout = () => {
    removeProjectFromSessionStorage();
  };

  useEffect(() => {
    const viewedProjects = JSON.parse(sessionStorage.getItem('viewedProjects')) || [];
    if (viewedProjects.includes(project._id)) {
      console.log('Project already viewed in this session');
    }
  }, [project._id]);



  const isSingleThumbnail = project?.thumbnails.length === 1;

  return (
    <div className="flex flex-col mx-3 my-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-gray-50 rounded-sm shadow-lg">

      <div className="relative">
        {!isSingleThumbnail && (
          <button
            onClick={prevImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <Link to={`/detail/${project._id}`} onClick={handleViewDetails}>
          <img
            src={project?.thumbnails[currentImageIndex]}
            alt={`Thumbnail ${currentImageIndex + 1}`}
            className="rounded-sm w-full h-48 object-cover"
          />
        </Link>
        {!isSingleThumbnail && (
          <button
            onClick={nextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex my-2 px-3 justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={project?.user?.avatar} />
          </Avatar>
          <p className="text-sm font-medium">{project?.user?.username}</p>
        </div>

        <div className="flex gap-5 text-gray-400">
          <button
            onClick={liked ? handleUnlike : handleLike}
            className={`flex items-center gap-1 text-sm ${liked ? 'text-pink-600' : 'text-gray-900'
              } transition`}
          >
            {liked ? <FaHeart className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
            <span>{likesCount}</span>
          </button>
          <div className="flex items-center gap-1 text-sm">
            <Eye className="w-4 h-4" />
            <span>{viewsCount}</span>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
