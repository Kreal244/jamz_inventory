import SetupHeader from "@/Pages/Setup/SetupHeader";
import Table from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, SetupsPageProps } from "@/types";
import { ColItem } from "@/types/components";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import FormModal from "@/Components/FormModal";
import FormLocation from "./Setup/FormLocation";
import { setups as setlupCols } from '../../asset/data/table.json'
import _ from "lodash";
const Setup = ({ auth }: PageProps) => {
    const { locations } = usePage<SetupsPageProps>().props;
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
    const cols: ColItem[] = _.take(setlupCols, 5);
    return (
        <Authenticated
            user={auth.user}
            header={<SetupHeader handleOpenModal={handleOpenModal} />}
        >
            <Head title="Setup" />
            <div
                className="relative shadow-md bg-sub-background round-sm max-h-[80vh]"
                id="setup"
            >
                <Table
                    data={locations}
                    cols={cols}
                    // handleEdit={(id) => console.log("hello" + id)}
                />
            </div>
            <FormModal name="setup" show={openModal} size="3xl">
                <FormLocation handleCloseModal={handleCloseModal} />
            </FormModal>
        </Authenticated>
    );
};
export default Setup;
