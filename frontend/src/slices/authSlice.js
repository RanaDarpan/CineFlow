import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authSuccess: (state,action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        authFail: (state,action) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        authLoading: (state, action) => {
            state.loading = true;
        }
    }
})

export default authSlice.reducer

export const {authSuccess, authFail, authLoading} = authSlice.actions