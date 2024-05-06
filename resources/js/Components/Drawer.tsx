import React, { PropsWithChildren, useState } from "react";
import { DrawerProps } from "@/types";
import _ from "lodash";

const Drawer = ({
    show,
    handleClose = () => {},
    children,
    header = "Default",
    footer,
    size = "lg:w-[65%]",
}: PropsWithChildren<DrawerProps>) => {
    return (
        <div
            className={`fixed top-0 right-0 h-full p-4 overflow-y-auto transition-transform ${
                show ? "translate-x-0" : "translate-x-full"
            } bg-[var(--background-sub-color)] ${size} w-[90%]  dark:bg-gray-800 z-50 shadow-lg`}
            tabIndex={-1}
        >
            <div className="drawer-header">
                {" "}
                <div
                    className="text-xl font-bold px-4 py-2 border-b"
                    onClick={handleClose}
                >
                    {header}
                </div>
            </div>
            <div className="drawer-body py-2 max-h-[88vh] h-full overflow-y-auto">
                {show ? children : <></>}
            </div>
            {!_.isEmpty(footer) && (
                <div className="drawer-footer">{footer}</div>
            )}
        </div>
    );
};

export default Drawer;
