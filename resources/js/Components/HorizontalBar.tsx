import { PropsWithChildren } from "react";
import ApplicationLogo from "./ApplicationLogo";
import { Dropdown, Button, Avatar } from "flowbite-react";
import { User } from "@/types";
import { HiViewList, HiX } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { sidebarState } from "@/types/state";
import { open, close } from "@/redux/reducers/sideBarReducer";
import Toast from "./Toast";
import _ from "lodash";
import axios from "axios";
const HorizontalBar = ({ user }: PropsWithChildren<{ user: User }>) => {
    const isOpen = useSelector((state: sidebarState) => state?.sidebar?.isOpen);
    const notiList = useSelector((state: any) => state.toast.payload);
    const dispatch = useDispatch();
    const handleLogout = () => {
        axios.post(route("logout")).then(() => location.reload());
    };
    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-main border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-light">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <Button
                                className="inline-flex items-center p-2 text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                onClick={() =>
                                    isOpen
                                        ? dispatch(close())
                                        : dispatch(open())
                                }
                            >
                                {isOpen ? <HiX /> : <HiViewList />}
                            </Button>
                            <a
                                href={route("dashboard")}
                                id="logo"
                                className="flex ms-2 md:me-24"
                            >
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </a>
                        </div>
                        <Dropdown
                            label={
                                <Avatar
                                    placeholderInitials={user.name[0].toLocaleUpperCase()}
                                    className="bg-danger rounded-[100%] text-sm mr-3 max-sm:hidden text-[#ffffff] font-bold"
                                />
                            }
                            className="flex items-center bg-background text-default"
                            inline
                        >
                            <Dropdown.Header>
                                <span className="block text-sm font-bold m-b-5">
                                    {user.name} #{user.id}
                                </span>
                                <span className="block truncate text-sm font-medium">
                                    {user.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item href="#">Profile</Dropdown.Item>
                            <Dropdown.Item href="#">Settings</Dropdown.Item>
                            <div className="divider"></div>
                            <Dropdown.Item
                                className="text-danger"
                                type="button"
                                onClick={handleLogout}
                            >
                                Sign out
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
            </nav>
            <div className="fixed z-50 right-3 top-20 grid gap-1">
                {!_.isEmpty(notiList) &&
                    notiList.map((item) => {
                        return (
                            <span key={item.id} className="shadow-lg">
                                <Toast
                                    id={item?.id}
                                    status={item?.status}
                                    message={item?.message}
                                />
                            </span>
                        );
                    })}
            </div>
        </>
    );
};
export default HorizontalBar;
