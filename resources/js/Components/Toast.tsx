import { Toast as FlowToast } from "flowbite-react";
import { PropsWithChildren } from "react";
import { FaInfo, FaCheck, FaExclamation } from "react-icons/fa6";
import { closeToast } from "@/redux/reducers/toastReducer";
import { useDispatch } from "react-redux";
const Toast = ({
    id,
    status,
    message,
}: PropsWithChildren<{
    status: "info" | "success" | "failure";
    message: string;
    id: number;
}>) => {
    const dispatch = useDispatch();
    const icon = {
        info: <FaInfo className="h-4 w-4" />,
        success: <FaCheck className="h-4 w-4" />,
        failure: <FaExclamation className="h-4 w-4" />,
    };
    setTimeout(() => {
        dispatch(closeToast(id));
    },30000)
    return (
        <FlowToast
            className={`bg-sub-background text-${status}`}
            id={`${id}`}
        >
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                {icon[status]}
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <FlowToast.Toggle
                onDismiss={() => {
                    dispatch(closeToast(id));
                }}
            />
        </FlowToast>
    );
};
export default Toast;
