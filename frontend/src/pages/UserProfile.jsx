import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import UserViewProjectCard from './UserViewProjectCard';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const { user } = useSelector((store) => store.auth);
    const userId = useParams().userId;

    const hasProjects = Array.isArray(userProjects) && userProjects.length > 0;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${PROJECT_API_END_POINT}/q/profile/${userId}`);

                if (response.data.success) {
                    setUserProfile(response.data.user); // Set the user data after successful fetch
                    setUserProjects(response.data.projects); // Set the user's projects
                } else {
                    console.error('Error fetching user profile:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (!userProfile) {
        return <div>Loading user profile...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col sm:flex-row items-center justify-center my-20 border border-gray-200 p-5 sm:p-10">
                <div className="flex items-center">
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                        <AvatarImage src={userProfile?.avatar || user?.avatar} />
                    </Avatar>
                    <div className="mx-4 flex flex-col">
                        <h1 className="text-2xl sm:text-3xl font-bold">{userProfile?.name || user?.name}</h1>
                        <p className="text-base sm:text-lg font-normal">{userProfile?.email || user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 p-5">
                {hasProjects ? (
                    userProjects.map((project) => (
                        <UserViewProjectCard key={project._id} project={project} />
                    ))
                ) : (
                    <p className="text-center text-xl">No projects available</p>
                )}
            </div>
        </>
    );
};
export default UserProfile;  