import { toastState } from '@/types/state';
import { useDispatch } from "react-redux"
import { toast } from "@/redux/reducers/toastReducer";
import store from '@/redux/store';
const showToast = (props: { status: "info" | "success" | "failure" | ""; message:string}) => {
    const payload: toastState = {
        toast: {
            id:
                new Date().getUTCMilliseconds() *
                (Math.floor(Math.random() * 100) + 1),
            ...props,
        },
    };
    store.dispatch(toast(payload));
};
export default showToast;