import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import _ from "lodash";
import { ColItem } from "@/types/components";
import { useState } from "react";
import Table from "@/Components/Table";
import { purchase_orders } from "../../asset/data/table.json";
const Purchase = ({ auth }: PageProps) => {
    const data = []
    const cols: ColItem[] = _.take(purchase_orders, 5);
    return (
        <Authenticated user={auth.user}>
            <Head title="Purchase-orders" />

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
export default Purchase;
