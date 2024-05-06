import ProductsHeader from "./Products/ProductsHeader";
import Table from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, ProductPageProps, SetupsPageProps } from "@/types";
import { ColItem, ModalProps } from "@/types/components";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import FormModal from "@/Components/FormModal";
import FormProduct from "./Products/FormProduct";
import FormTransferOrder from "./Products/FormTransferOrder";
import { products as productCols } from "../../asset/data/table.json";
import _ from "lodash";
import FormDetailProduct from "@/Pages/Products/FormDetailProduct";
const Products = ({ auth }: PageProps) => {
    const { products, locations } = usePage<
        ProductPageProps & SetupsPageProps
    >().props;
    const { data, setData } = useForm({
        openModal: false,
        type: "",
        size: "" as ModalProps["size"],
    });
    const handleOpenModal = (
        type: string,
        size:
            | "sm"
            | "md"
            | "lg"
            | "xl"
            | "2xl"
            | "3xl"
            | "4xl"
            | "5xl"
            | "6xl"
            | "7xl"
    ) => {
        setData({ openModal: true, type: type, size: size });
    };
    const handleCloseModal = () => {
        setData({ openModal: false, type: "", size: "" as ModalProps["size"] });
    };
    const modalElements = {
        new_product: <FormProduct handleCloseModal={handleCloseModal} />,
        transfer_order: (
            <FormTransferOrder
                handleCloseModal={handleCloseModal}
                locations={locations}
                products={products}
            />
        ),
    };

    // MOCK DATA
    // const data = [

    // ];
    const cols: ColItem[] = _.take(productCols, 5);
    return (
        <Authenticated
            header={<ProductsHeader handleOpenModal={handleOpenModal} />}
            user={auth.user}
        >
            <Head title="Products" />
            <div
                className=" shadow-md bg-sub-background round-sm max-md:w-[90vw] max-h-[80vh] p-2"
                id="products"
            >
                <Table
                    data={products}
                    cols={cols}
                    enableClick={true}
                    type="product"
                    drawerComponent={(item, handleClose) => (
                        <FormDetailProduct
                            locations={locations}
                            item={item}
                            handleClose={handleClose}
                        />
                    )}
                />
            </div>
            <FormModal
                name={data.type.replaceAll("_", " ")}
                show={data.openModal}
                size={data.size ?? "3xl"}
            >
                {modalElements[data.type]}
            </FormModal>
        </Authenticated>
    );
};
export default Products;
