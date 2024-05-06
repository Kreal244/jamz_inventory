import Header from "@/Components/Header";
import { FaPlus } from "react-icons/fa6";
const ProductsHeader = (props: { handleOpenModal: CallableFunction }) => {
    return (
        <Header>
            <div className="flex justify-between max-sm:flex-col max-sm:gap-2">
                <div className="uppercase text-lg font-bold">Products</div>
                <div className="flex gap-1">
                    <button
                        className="bg-link flex items-center gap-1 max-md:text-xsm"
                        id="new_product"
                        onClick={(e) =>
                            props?.handleOpenModal(e.currentTarget.id, "3xl")
                        }
                    >
                        <FaPlus /> add new products
                    </button>
                    <button
                        className="bg-link flex items-center gap-1 max-md:text-xsm"
                        id="transfer_order"
                        onClick={(e) =>
                            props?.handleOpenModal(e.currentTarget.id, "3xl")
                        }
                    >
                        <FaPlus /> transfer order
                    </button>
                </div>
            </div>
        </Header>
    );
};
export default ProductsHeader;
