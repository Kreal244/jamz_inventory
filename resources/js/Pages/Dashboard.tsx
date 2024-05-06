import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps, SetupsPageProps, SpreadsheetProps } from "@/types";
import { ListItems } from "@/types/dashboard";
import {
    FaBagShopping,
    FaBox,
    FaChartPie,
    FaChevronRight,
    FaEllipsis,
    FaFileCirclePlus,
    FaUsersGear,
    FaWarehouse,
    FaCartShopping,
    FaCashRegister,
} from "react-icons/fa6";
import ItemField from "./Dashboard/Item";
import Partition from "./Dashboard/Partition";
import FormModal from "@/Components/FormModal";
import { useState } from "react";
import FormTransferOrder from "./Products/FormTransferOrder";
import FormProduct from "./Products/FormProduct";
import FormVendor from "./Vendors/FormVendor";
import FormPO from "./Purchasing/FormPO";
import { locationTypes, productTypes } from "../../asset/data/type.json";
import { ProductPageProps } from "@/types";
import FormSpreadsheet from "./Dashboard/FormSpreadsheet";
import FormLocation from "./Setup/FormLocation";
export default function Dashboard({ auth }: PageProps) {
    const [type, setType] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const { products, locations, spreadsheets } = usePage<
        ProductPageProps & SetupsPageProps & SpreadsheetProps
    >().props;

    const party_1_items: ListItems[] = [
        {
            title: "Warehouse",
            icon: <FaFileCirclePlus />,
            color: "var(--sub-color)",
            dropdown: [
                {
                    name: "New location",
                    route: "#",
                    callback: (type) => handleOpenModal(type),
                },
            ],
            features: [{ name: "View location list", route: route("setup") }],
        },
        // {
        //     title: "Purchasing",
        //     icon: <FaBagShopping />,
        //     color: "var(--sub-color)",
        //     dropdown: [
        //         {
        //             name: "New PO",
        //             route: "#",
        //             callback: (type) => handleOpenModal(type),
        //         },
        //         {
        //             name: "New vendor",
        //             route: "#",
        //             callback: (type) => handleOpenModal(type),
        //         },
        //     ],
        //     features: [
        //         { name: "View PO list", route: route("purchases") },

        //         { divider: <hr /> },
        //         { name: "View vendors list", route: route("vendors") },
        //     ],
        // },
        {
            title: "Inventory",
            icon: <FaWarehouse />,
            color: "var(--sub-color)",
            dropdown: [
                {
                    name: "New product",
                    route: "#",
                    callback: (type) => handleOpenModal(type),
                },
                {
                    name: "Transfer order",
                    route: "#",
                    callback: (type) => handleOpenModal(type),
                },
                { name: "New inventory", route: "#" },
            ],
            features: [
                {
                    name: "View products list",
                    route: route("products"),
                },

                { divider: <hr /> },
                { name: "View inventory list", route: route("inventories") },
            ],
        },
        // {
        //     title: "Selling",
        //     icon: <FaCashRegister />,
        //     color: "var(--sub-color)",
        //     dropdown: [
        //         { name: "New sales order", route: "#" },
        //         { name: "New buyer", route: "#" },
        //     ],
        //     features: [
        //         { name: "View sales order list", route: route("sales") },
        //         { divider: <hr /> },
        //         { name: "View buyer list", route: route("buyers") },
        //     ],
        // },
    ];
    const party_2_item: { title: string; route: string }[] = [
        // { title: "Purchasing", route: "#" },
        { title: "Stock count", route: "#" },
        // { title: "Sales", route: "#" },
        { title: "Purchase order", route: "#" },
        // { title: "Generate invoice", route: "#" },
    ];
    const party_3_item: {
        title: string;
        callback?: CallableFunction;
        route?: string;
        type?: string;
    }[] = [
        {
            title: "Spreadsheet action",
            callback: (type) => handleOpenModal(type),
            type: "spreadsheet",
        },
    ];
    //Callback
    const handleOpenModal = (type: string) => {
        setOpenModal(true);
        setType(type);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setType("");
    };
    const modalFormElement = {
        new_location: {
            child: <FormLocation handleCloseModal={handleCloseModal} />,
            size: "2xl",
        },
        new_po: {
            child: <FormPO handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        new_vendor: {
            child: <FormVendor handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        new_product: {
            child: <FormProduct handleCloseModal={handleCloseModal} />,
            size: "3xl",
        },
        adjust_product: {
            child: <FormVendor handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        delete_product: {
            child: <FormVendor handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        transfer_order: {
            child: (
                <FormTransferOrder
                    handleCloseModal={handleCloseModal}
                    locations={locations}
                    products={products}
                />
            ),
            size: "xl",
        },
        new_inventory: {
            child: <FormVendor handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        adjust_inventory: {
            child: <FormVendor handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        new_so: {
            child: <FormVendor handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        new_buyer: {
            child: <FormVendor handleCloseModal={handleCloseModal} />,
            size: "xl",
        },
        spreadsheet: {
            child: (
                <FormSpreadsheet
                    handleCloseModal={handleCloseModal}
                    spreadsheets={spreadsheets}
                />
            ),
            size: "2xl",
        },
    };

    return (
        <Authenticated user={auth.user}>
            <Head title="Dashboard" />
            <div className="px-5 " id="dashboard">
                <div className="max-w-7xl mx-auto xsm:px-2 sm:px-4">
                    <div className="overflow-hidden ">
                        <div className="md:p-2">
                            <Partition id="party-1">
                                <div className="grid lg:grid-cols-3 lg:gap-4 sm:max-lg:grid-cols-2 sm:max-lg:gap-3 grid-cols-1 max-sm:gap-3 md:grid-cols-1">
                                    <ItemField data={party_1_items} />
                                </div>
                            </Partition>
                            <Partition
                                id="party-2"
                                header={{
                                    title: "report",
                                    icon: <FaChartPie />,
                                    color: "var(--sub-color)",
                                }}
                            >
                                <div
                                    className="grid 
                                    gap-2 grid-cols-2
                                    sm:max-lg:grid-cols-3
                                lg:grid-cols-4 lg:gap-4
                                max-md:text-xsm"
                                >
                                    {party_2_item.map((item) => {
                                        return (
                                            <a
                                                href={item.route}
                                                key={item.title}
                                                className="flex items-center max-ms:max-w-20 max-md:max-w-24 lg:w-50 justify-between capitalize shadow-md p-3 rounded-r-lg"
                                            >
                                                <span className="max-w-28">
                                                    {item.title}
                                                </span>
                                                <FaChevronRight className="text-sm " />
                                            </a>
                                        );
                                    })}
                                </div>
                            </Partition>
                            <Partition
                                id="party-3"
                                header={{
                                    title: "extra features",
                                    icon: <FaEllipsis />,
                                    color: "var(--sub-color)",
                                }}
                            >
                                <div
                                    className="grid 
                                    gap-2 grid-cols-2
                                    sm:max-lg:grid-cols-3
                                lg:grid-cols-4 lg:gap-4
                                max-md:text-xsm"
                                >
                                    {party_3_item.map((item) => {
                                        return (
                                            <a
                                                href={item.route}
                                                key={item.title}
                                                className="flex items-center max-ms:max-w-20 max-md:max-w-24 lg:w-50 justify-between capitalize shadow-md p-3 rounded-r-lg"
                                                onClick={() =>
                                                    handleOpenModal(
                                                        item.type ?? ""
                                                    )
                                                }
                                            >
                                                <span className="max-w-40">
                                                    {item.title}
                                                </span>
                                                <FaChevronRight className="text-sm " />
                                            </a>
                                        );
                                    })}
                                </div>
                            </Partition>
                        </div>
                    </div>
                </div>
            </div>
            <FormModal
                name={type.replaceAll("_", " ").toLocaleUpperCase()}
                show={openModal}
                size={modalFormElement[type]?.size}
            >
                {modalFormElement[type]?.child}
            </FormModal>
        </Authenticated>
    );
}
