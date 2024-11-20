import { PROJECT_API_END_POINT } from "@/utils/constant";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name: "projects",
    initialState: {
        projects: [],
        userProjects: [],
        filterProjects: [],
        singleProject: {},
        searchQuery: "",
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        setProjects: (state,action) => {
            state.projects = action.payload; 
        },
        setSingleProject: (state, action) => {
            state.singleProject = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload
        },
        setUserProjects: (state, action) => {
            state.userProjects = action.payload;
        },
        setFilterProjects: (state, action) => {
            state.filterProjects = action.payload;
        },
        


    
    }
});

export const { setProjects, setSingleProject, setSearchQuery, setLoading, setError, setSuccessMessage,setUserProjects, setFilterProjects } = projectSlice.actions;
export default projectSlice.reducer;
