import { createSlice } from "@reduxjs/toolkit";

export const LoadingSlice = createSlice({
    name: "sidebar",
    initialState: {
        isOpen: false,
    },
    reducers: {
        openLoading: (state) => {
            state.isOpen = true;
        },
        closeLoading: (state) => {
            state.isOpen = false;
        },
    },
});
export const { openLoading, closeLoading } = LoadingSlice.actions;
export default LoadingSlice.reducer;
