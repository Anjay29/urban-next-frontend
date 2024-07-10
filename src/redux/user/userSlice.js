import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        refreshPage: (state) => {
            state.error = null,
            state.loading = false
        },
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state,action) => {
            state.loading = false,
            state.currentUser = action.payload
            state.error = null
            // console.log(action.payload);
        },
        signInFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.loading = false,
            state.currentUser = action.payload,
            state.error = null
        },
        updateUserFailure: (state, action) =>{
            state.error = action.payload,
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            state.error = null,
            state.currentUser = null,
            state.loading = false
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        signOutUserStart: (state) => {
            state.loading = true
        },
        signOutUserSuccess: (state) => {
            state.error = null,
            state.currentUser = null,
            state.loading = false
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        }
    }
})

export const {signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFailure, refreshPage} = userSlice.actions;
export default userSlice.reducer;