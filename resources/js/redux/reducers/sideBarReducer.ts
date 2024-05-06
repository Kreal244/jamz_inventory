import { createSlice } from "@reduxjs/toolkit";

export const SibeBarSlice = createSlice({
    name: "sidebar",
    initialState: {
        isOpen: false,
    },
    reducers: {
        open: (state) => {
            state.isOpen = true;
        },
        close: (state) => {
            state.isOpen = false;
        },
    },
});
export const { open, close } = SibeBarSlice.actions;
export default SibeBarSlice.reducer;
