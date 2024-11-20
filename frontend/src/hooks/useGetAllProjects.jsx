import { setProjects } from '@/redux/projectSlice';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllProjects = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const res = await axios.get(`${PROJECT_API_END_POINT}/projects`, {withCredentials: true});
                if (res.data.success) {
                    console.log(res.data); // Log API respon
                    dispatch(setProjects(res.data.projects));
                    console.log(res.data); // Log API respon
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllProjects();
    }, [dispatch])
}

export default useGetAllProjects
