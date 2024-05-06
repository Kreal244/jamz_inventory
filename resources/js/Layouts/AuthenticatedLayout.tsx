import { useState, PropsWithChildren, ReactNode } from "react";
import { User } from "@/types";
import { authLayoutState, loadingState, sidebarState } from "@/types/state";
import VerticalBar from "@/Components/VerticalBar";
import HorizontalBar from "@/Components/HorizontalBar";
import { useDispatch, useSelector } from "react-redux";
import { close } from "@/redux/reducers/sideBarReducer";
import Modal from "@/Components/Modal";
import LoadingOverlay from "react-loading-overlay-ts";
import _ from "lodash";
import ImportFile from "@/Pages/General/ImportFile";
import ExportFile from "@/Pages/General/ExportFile";

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const theme = localStorage.getItem("theme") ?? "default";
    const isOpen = useSelector((state: sidebarState) => state?.sidebar?.isOpen);
    const showLoading = useSelector(
        (state: loadingState) => state?.loading?.isOpen
    );
    const modal = useSelector(
        (state: { modal: authLayoutState }) => state?.modal?.modal
    );
    const dispatch = useDispatch();
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768 && isOpen) {
            dispatch(close());
        }
    });
    const IOFileModal = (modalType, dataType) => {
        const type = {
            import: <ImportFile type={dataType} />,
            export: <ExportFile exportType={dataType} />,
        };
        return type[modalType];
    };
    return (
        <LoadingOverlay
            active={showLoading}
            spinner
            text="Loading your content..."
            styles={{
                overlay: (base) => ({
                    ...base,
                    position: "fixed",
                }),
            }}
        >
            <div className={"bg-gray-100 " + theme}>
                <HorizontalBar user={user}></HorizontalBar>
                <VerticalBar />
                <div className="p-4 md:ml-64 text-default mt-[75px] max-h-[87vh] xsm:text-xsm md:text-sm">
                    {header && (
                        <header className="bg-sub-background shadow">
                            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-5 lg:px-6">
                                {header}
                            </div>
                        </header>
                    )}
                    <main className={header ? "mt-3" : ""}>{children}</main>
                </div>
                <Modal show={!!modal.isOpen} maxWidth="xl" closeable={false}>
                    {IOFileModal(modal.type, modal.dataType)}
                </Modal>
            </div>
        </LoadingOverlay>
    );
}
