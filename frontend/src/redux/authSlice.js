import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        logoutUser(state) {
            state.user = null;
            state.loading = false; // Reset loading state
        },
    },
});

export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
