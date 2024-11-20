import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react'; // Import Lucide icons
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const { user } = useSelector((store) => store.auth);

  // State to keep track of the current visible thumbnail
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    if (currentImageIndex < project?.thumbnails.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0); // Loop back to the first image
    }
  };

  // Function to go to the previous image
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(project?.thumbnails.length - 1); // Loop to the last image
    }
  };

  // Check if there is only one thumbnail
  const isSingleThumbnail = project?.thumbnails.length === 1;

  return (
    <div className="flex flex-col mx-3 my-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-gray-50 rounded-sm shadow-lg">
      {/* Thumbnail and Image Navigation */}
      <div className="relative">
        <button
          onClick={prevImage}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${isSingleThumbnail ? 'hidden cursor-not-allowed' : ''}`}
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
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${isSingleThumbnail ? 'hidden cursor-not-allowed' : ''}`}
          disabled={isSingleThumbnail}
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Project Info */}
      <div className="flex my-2 px-3 justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={project?.user?.avatar} />
          </Avatar>
          <p className="text-md font-medium text-sm sm:text-base">{project?.user?.username}</p>
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

export default ProjectCard;
