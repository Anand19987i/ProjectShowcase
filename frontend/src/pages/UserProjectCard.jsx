import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { setProjects } from '@/redux/projectSlice';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react'; // Import Lucide icons
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserProjectCard = ({ project }) => {
  const { user } = useSelector((store) => store.auth);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
      setCurrentImageIndex(project?.thumbnails.length - 1); // Loop to the last image
    }
  };
  const isSingleThumbnail = project?.thumbnails.length === 1;

  return (
    <div className="flex flex-col mx-3 my-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4  bg-gray-50 rounded-sm shadow-lg">
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={prevImage}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${
            isSingleThumbnail ? 'hidden cursor-not-allowed' : ''
          }`}
          disabled={isSingleThumbnail}
        >
          <ChevronLeft className="w-3 h-3" /> {/* Use the ChevronLeft icon */}
        </button>

        {/* Image */}
        <Link to={`/detail/${project._id}`}>
          <img
            src={project?.thumbnails[currentImageIndex]}
            alt={`Thumbnail ${currentImageIndex + 1}`}
            className="rounded-sm w-full h-48 overflow-hidden"
          />
        </Link>

        {/* Right Arrow */}
        <button
          onClick={nextImage}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${
            isSingleThumbnail ? 'hidden cursor-not-allowed' : ''
          }`}
          disabled={isSingleThumbnail}
        >
          <ChevronRight className="w-3 h-3" /> {/* Use the ChevronRight icon */}
        </button>
      </div>

      <div className="flex my-2 px-3 justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={project?.user?.avatar} />
          </Avatar>
          <p className="text-md font-medium text-sm sm:text-base">{user?.username}</p>
        </div>
        <div>
          <div className="flex gap-5 text-gray-400">
            <p className="flex items-center gap-1 text-sm hover:text-gray-600 transition">
              <Heart className="w-4 h-4" /> 90
            </p>
            <p className="flex items-center gap-1 text-sm hover:text-gray-600 transition">
              <Eye className="w-4 h-4" /> 28
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProjectCard;
