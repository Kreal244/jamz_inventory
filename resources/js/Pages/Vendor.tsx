import Table from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { ColItem } from "@/types/components";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import FormModal from "@/Components/FormModal";
import { vendors } from "../../asset/data/table.json";
import _ from "lodash";
const Vendors = ({ auth }: PageProps) => {
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const data = [];
    const cols: ColItem[] = _.take(vendors, 5);
    return (
        <Authenticated user={auth.user}>
            <Head title="Vendors" />
            <div
                className="relative shadow-md bg-sub-background round-sm max-h-[80vh]"
                id="vendors"
            >
                <Table
                    data={data}
                    cols={cols}
                    // handleEdit={(id) => console.log("hello" + id)}
                />
            </div>
            <FormModal name="vendors" show={openModal} size="3xl"></FormModal>
        </Authenticated>
    );
};
export default Vendors;
