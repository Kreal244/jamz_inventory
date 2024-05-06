import { authLayoutState } from "@/types/state";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const AuthLayoutSlice = createSlice({
    name: "modal",
    initialState: {
        modal: { isOpen: false, type: "", dataType: "" },
    },
    reducers: {
        openModal: (state, action: PayloadAction<authLayoutState>) => {
            state.modal = {
                ...state.modal,
                isOpen: true,
                type: action.payload.modal.type,
                dataType: action.payload.modal?.dataType ?? "",
            };
        },
        closeModal: (state) => {
            state.modal = {
                ...state.modal,
                isOpen: false,
                type: "",
                dataType: "",
            };
        },
    },
});
export const { openModal, closeModal } = AuthLayoutSlice.actions;
export default AuthLayoutSlice.reducer;
