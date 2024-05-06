import { Sidebar, Button } from "flowbite-react";
import { PropsWithChildren } from "react";
import {
    FaBorderAll,
    FaFileCirclePlus,
    FaMinus,
    FaPlus,
    FaAnglesLeft,
    FaBox,
    FaBagShopping,
    FaClipboardList,
    FaFileImport,
    FaFileExport,
    FaGear,
    FaCashRegister,
    FaUsersGear,
    FaCartShopping,
    FaWarehouse,
} from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { authLayoutState, sidebarState } from "@/types/state";
import { close, open } from "@/redux/reducers/sideBarReducer";
import { openModal } from "@/redux/reducers/ioFileReducer";
const VerticalBar = ({}: PropsWithChildren<{}>) => {
    const isOpen = useSelector((state: sidebarState) => state?.sidebar?.isOpen);
    const dispatch = useDispatch();
    const handleImport = () => {
        const payload: authLayoutState = {
            modal: {
                type: "import",
            },
        };
        dispatch(openModal(payload));
    };
    const handleExport = () => {
        const payload: authLayoutState = {
            modal: {
                type: "export",
            },
        };
        dispatch(openModal(payload));
    };
    const isActive = (path: string) =>
        window.location.href === path ? "active" : "";
    return (
        <>
            <Sidebar
                aria-label="sidebar "
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform  bg-sub border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:translate-x-0 ${
                    isOpen ? "" : "-translate-x-full"
                } text-default min-h-full text-capitalize
                pl-4`}
                id="sidebar"
            >
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item
                            href={route("dashboard")}
                            icon={FaBorderAll}
                            className={isActive(route("dashboard").toString())}
                        >
                            Dashboard
                        </Sidebar.Item>
                        <Sidebar.Item
                            icon={FaFileCirclePlus}
                            href={route("setup")}
                            className={isActive(route("setup").toString())}
                        >
                            Warehouse
                        </Sidebar.Item>
                        <div className="divider_nav"></div>
                        {/* <Sidebar.Item
                            href={route("purchases")}
                            icon={FaBagShopping}
                            className={isActive(route("purchases").toString())}
                        >
                            Purchasing
                        </Sidebar.Item>
                        <Sidebar.Item
                            href={route("vendors")}
                            icon={FaUsersGear}
                            className={isActive(route("vendors").toString())}
                        >
                            Vendor
                        </Sidebar.Item>
                        <div className="divider_nav"></div> */}
                        <Sidebar.Item
                            href={route("inventories")}
                            icon={FaWarehouse}
                            className={isActive(
                                route("inventories").toString()
                            )}
                        >
                            Inventory
                        </Sidebar.Item>
                        <Sidebar.Item
                            icon={FaBox}
                            href={route("products")}
                            className={isActive(route("products").toString())}
                        >
                            Products
                        </Sidebar.Item>
                        <div className="divider_nav"></div>
                        {/* <Sidebar.Item
                            href={route("sales")}
                            icon={FaCashRegister}
                            className={isActive(route("sales").toString())}
                        >
                            Sales
                        </Sidebar.Item>
                        <Sidebar.Item
                            href={route("buyers")}
                            icon={FaCartShopping}
                            className={isActive(route("buyers").toString())}
                        >
                            Buyers
                        </Sidebar.Item>
                        <div className="divider_nav"></div> */}
                        <Sidebar.Item
                            icon={FaClipboardList}
                            href={route("logs")}
                            className={isActive(route("logs").toString())}
                        >
                            Log
                        </Sidebar.Item>
                        {/* TODO: Hiddent temporary */}
                        {/* <div className="divider_nav"></div>
                        <Sidebar.Item
                            icon={FaGear}
                            href={route("options")}
                            className={isActive(route("options").toString())}
                        >
                            Options
                        </Sidebar.Item> */}
                    </Sidebar.ItemGroup>
                    <div className="divider_nav"></div>
                    {/* Features */}
                    <Sidebar.ItemGroup aria-label="feature" className="grid">
                        <Button
                            className="btn-feature"
                            onClick={() => {
                                handleImport();
                            }}
                        >
                            <FaFileImport />
                            <span>import</span>
                        </Button>
                        <Button
                            className="btn-feature"
                            onClick={() => {
                                handleExport();
                            }}
                        >
                            <FaFileExport />
                            <span>export</span>
                        </Button>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
                {/* Collapse sidebar */}
                <Sidebar.ItemGroup className=" md:hidden">
                    <Button
                        className="w-full border-s-1 bg-default text-light"
                        onClick={() => {
                            dispatch(close());
                        }}
                    >
                        <FaAnglesLeft />
                    </Button>
                </Sidebar.ItemGroup>
            </Sidebar>
            <div
                className={`${isOpen ? "cover" : ""}` + " z-39 fixed"}
                onClick={() => dispatch(close())}
            ></div>
        </>
    );
};
export default VerticalBar;
