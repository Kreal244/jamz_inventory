import { configureStore } from "@reduxjs/toolkit";
import SidebarReducer from "@/redux/reducers/sideBarReducer";
import toastReducer from "@/redux/reducers/toastReducer";
import loadingReducer from "./reducers/loadingReducer";
import ioFileReducer from "./reducers/ioFileReducer";
const store = configureStore({
    reducer: {
        sidebar: SidebarReducer,
        toast: toastReducer,
        loading: loadingReducer,
        modal: ioFileReducer,
    },
});
export default store;
