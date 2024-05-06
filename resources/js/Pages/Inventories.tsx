import Table from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { ColItem } from "@/types/components";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import FormModal from "@/Components/FormModal";

const Inventories = ({ auth }: PageProps) => {
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const data = [
        {
            id: 12,
            name: "khang",
            date: "234",
        },
        {
            id: 13,
            name: "khang",
            date: "2354",
        },
        {
            id: 14,
            name: "khang",
            date: "2234",
        },
    ];
    const cols: ColItem[] = [
        {
            colName: "name",
            shortcut: "name",
        },
        {
            colName: "date",
            shortcut: "date",
        },
    ];
    return (
        <Authenticated user={auth.user}>
            <Head title="Inventories" />
            <div
                className="relative shadow-md bg-sub-background round-sm max-h-[80vh]"
                id="inventories"
            >
                <Table
                    data={data}
                    cols={cols}
                    handleEdit={(id) => console.log("hello" + id)}
                />
            </div>
            <FormModal name="inventories" show={openModal} size="3xl"></FormModal>
        </Authenticated>
    );
};
export default Inventories;
