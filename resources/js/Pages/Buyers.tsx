import Table from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { ColItem } from "@/types/components";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import FormModal from "@/Components/FormModal";
import { buyers } from "../../asset/data/table.json";
import _ from "lodash";
const Buyers = ({ auth }: PageProps) => {
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const data = [];
    const cols: ColItem[] = _.take(buyers, 6);
    return (
        <Authenticated user={auth.user}>
            <Head title="Buyers" />
            <div
                className="relative shadow-md bg-sub-background round-sm max-h-[80vh]"
                id="buyers"
            >
                <Table data={data} cols={cols} />
            </div>
            <FormModal name="buyers" show={openModal} size="3xl"></FormModal>
        </Authenticated>
    );
};
export default Buyers;
