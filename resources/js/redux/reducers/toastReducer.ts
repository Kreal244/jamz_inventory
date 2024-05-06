import { toastState } from "@/types/state";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
export const toastSlice = createSlice({
    name: "toast",
    initialState: {
        payload: [] as toastState["toast"][],
    },
    reducers: {
        toast: (state, action: PayloadAction<toastState>) => {
            state.payload.push(action.payload.toast);
        },
        closeToast: (state, action: PayloadAction<number>) => {
            const remove_indx = _.findIndex(state.payload, function (o) {
                return o.id == action.payload;
            });
            state.payload = _.difference(state.payload, [state.payload[remove_indx]]);
        },
    },
});
export const { toast, closeToast } = toastSlice.actions;
export default toastSlice.reducer;
