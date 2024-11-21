import { setProjects, setUserProjects } from '@/redux/projectSlice';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const useGetUserProject = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserProjects = async () => {
            try {
                const res = await axios.post(`${PROJECT_API_END_POINT}/profile/${user?.id}`, {withCredentials : true});
                if (res.data.success) {
                    dispatch(setUserProjects(res.data.projects));
                }
            } catch (error) {
                console.log("Errorr project fetching: ", error);
            }
        }
        if (user?.id) {
            fetchUserProjects();
          };
      }, [dispatch])
}

export default useGetUserProject
