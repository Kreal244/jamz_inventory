import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import _ from "lodash";
import { ColItem } from "@/types/components";
import { useState } from "react";
import Table from "@/Components/Table";
import { sale_orders } from "../../asset/data/table.json";

const Sale = ({ auth }: PageProps) => {
    const data = [];
    const cols: ColItem[] = _.take(sale_orders, 5);
    return (
        <Authenticated user={auth.user}>
            <Head title="Sales" />

            <div
                className="relative shadow-md bg-sub-background round-sm max-h-[80vh]"
                id="products"
            >
                <Table
                    data={data}
                    cols={cols}
                    // handleEdit={(id) => console.log("hello" + id)}
                />
            </div>
        </Authenticated>
    );
};
export default Sale;
