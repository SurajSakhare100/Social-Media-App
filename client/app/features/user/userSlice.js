// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isActive: false,
        userDetails: null,
    },
    reducers: {
        setActive: (state) => {
            state.isActive = true;
        },
        setInactive: (state) => {
            state.isActive = false;
        },
        userDetails: (state, action) => {
            state.userDetails = action.payload;
        },
    },
});

export const { setActive, setInactive, userDetails } = userSlice.actions;

export default userSlice.reducer;
