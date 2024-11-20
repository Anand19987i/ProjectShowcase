import { Avatar, AvatarImage } from '@/components/ui/avatar';
import store from '@/redux/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { ArrowUpFromLine, Edit } from 'lucide-react';
import EditProfile from './EditProfile';
import { Link } from 'react-router-dom';
import useGetUserProject from '@/hooks/useGetUserProject';
import UserProjectCard from './UserProjectCard';

const ViewProfile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { userProjects } = useSelector((store) => store.project);

  useGetUserProject();

  // Check if userProjects is an array and has a length
  const hasProjects = Array.isArray(userProjects) && userProjects.length > 0;

  return (
    <>
      <Navbar />
      <div className="flex flex-col sm:flex-row items-center justify-center my-20 border border-gray-200 p-5 sm:p-10">
        <div className="flex items-center">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
            <AvatarImage src={user?.avatar} />
          </Avatar>
          <div className="mx-4 flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold">{user?.name}</h1>
            <p className="text-base sm:text-lg font-normal">{user?.email}</p>
            <div className="flex flex-col sm:flex-row gap-5 mt-6 sm:mt-0">
              <button
                onClick={() => setOpen(true)}
                className="text-sm sm:text-base outline-none border border-gray-200 p-2 sm:px-3 rounded-lg font-semibold flex gap-2"
              >
                <Edit /> Edit Profile
              </button>
              <Link to="/upload/project">
                <button className="text-sm sm:text-base outline-none border border-gray-200 p-2 sm:px-3 rounded-lg font-semibold flex gap-2 mt-3 sm:mt-0">
                  <ArrowUpFromLine /> Upload Project
                </button>
              </Link>
            </div>
          </div>
        </div>
        <EditProfile open={open} setOpen={setOpen} />
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-5">
        {hasProjects ? (
          userProjects.map((project) => (
            <UserProjectCard key={project._id} project={project} />
          ))
        ) : (
          <p className="text-center text-xl">No projects available</p>
        )}
      </div>
    </>
  );
};

export default ViewProfile;
