import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import { FaHeart } from 'react-icons/fa';

const UserViewProjectCard = ({ project }) => {
  const { user } = useSelector((store) => store.auth);
  const { userProjects } = useSelector(store => store.project)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(project.views);

  useEffect(() => {
    if (project.likes && user) {
      setLiked(project.likes.includes(user.id));
      setLikesCount(project.likes.length);
    }
  }, [project.likes, user]);

  const nextImage = () => {
    if (currentImageIndex < project?.thumbnails.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(project?.thumbnails.length - 1);
    }
  };

  const isSingleThumbnail = project?.thumbnails.length === 1;

  const handleLike = async () => {
    setLiked(true);
    setLikesCount(likesCount + 1);
    try {
      await axios.post(
        `${PROJECT_API_END_POINT}/like/${project._id}`,
        { userId: user?.id },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error liking project:", error.response?.data || error.message);
      setLiked(false);
      setLikesCount(likesCount - 1);
    }
  };

  const handleUnlike = async () => {
    try {
      setLiked(false);
      setLikesCount(likesCount - 1);

      const response = await axios.delete(
        `${PROJECT_API_END_POINT}/like/${project._id}`,
        {
          data: { userId: user.id },
          withCredentials: true,
        }
      );

      console.log("Unlike successful:", response.data.message);
    } catch (error) {
      console.error("Error unliking project:", error);
      setLiked(true);
      setLikesCount(likesCount + 1);
    }
  };

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

  return (
    <div className="flex flex-col mx-3 my-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-gray-50 rounded-sm shadow-lg relative">
      <div className="relative">
        <button
          onClick={prevImage}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${isSingleThumbnail ? 'hidden cursor-not-allowed' : ''
            }`}
          disabled={isSingleThumbnail}
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <Link to={`/detail/${project._id}`}>
          <img
            src={project?.thumbnails[currentImageIndex]}
            alt={`Thumbnail ${currentImageIndex + 1}`}
            className="rounded-sm w-full h-48 overflow-hidden"
          />
        </Link>
        <button
          onClick={nextImage}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${isSingleThumbnail ? 'hidden cursor-not-allowed' : ''
            }`}
          disabled={isSingleThumbnail}
        >
          <ChevronRight className="w-3 h-3" />
        </button>


      </div>

      <div className="flex my-2 px-3 justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={project?.user?.avatar} />
          </Avatar>
          <p className="text-md font-medium text-sm sm:text-base">{project?.user?.username}</p>
        </div>
        <div>
          <div className="flex gap-5 text-gray-400">
            <button
              onClick={liked ? handleUnlike : handleLike}
              className={`flex items-center gap-1 text-sm ${liked ? 'text-pink-600' : 'text-gray-900'
                } transition`}
            >
              {liked ? <FaHeart className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
              <span>{likesCount}</span>
            </button>
            <p className="flex items-center gap-1 text-sm hover:text-gray-600 transition">
              <Eye className="w-4 h-4" /> {viewsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserViewProjectCard;
