import React from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Label, TextInput, Select } from "flowbite-react";
import showToast from "@/util/showToast";
import { Products, Setups } from "@/types";
import { lazy, Suspense, useEffect, useState } from "react";
import _ from "lodash";
import { FaTrash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
const ProductList = ({
    products,
    selectedProduct,
    handleSelectProduct,
}: {
    products: Products[];
    selectedProduct: Products[];
    handleSelectProduct: CallableFunction;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Products[]>([]);
    const list = _.differenceWith(products, selectedProduct, _.isEqual);
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
        const results = list.filter((product) =>
            (product?.product_name ?? "")
                .toLowerCase()
                .includes(term.toLowerCase())
        );
        setSearchResults(results);
    };
    return (
        <div className="mt-5">
            <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul className="max-h-[30vh] min-h-[10vh] overflow-y-auto mt-3 p-1 ">
                {searchResults.length > 0
                    ? searchResults.map((product, index) => (
                          <React.Fragment key={index + product.product_id}>
                              <li
                                  key={product.product_name}
                                  onClick={() => handleSelectProduct(product)}
                                  className="cursor-pointer bg-sub-background pl-7 text-sm  hover:bg-sub hover:text-primary flex gap-3"
                              >
                                  <img
                                      src={
                                          product?.image ||
                                          "https://shelf-hawk-web-1.s3.amazonaws.com/shelf-hawk-web-1/storage/products/images/default.jpg"
                                      }
                                      className="w-10 h-10"
                                  />
                                  <div>
                                      <b>{product.product_name}</b>
                                      <div className="max-w-[80%] text-ellipsis">
                                          {product.item_description ?? ""}
                                      </div>
                                  </div>
                              </li>
                              {index != searchResults.length - 1 && (
                                  <hr className="p-0 my-1" />
                              )}
                          </React.Fragment>
                      ))
                    : list.map((product, index) => (
                          <React.Fragment key={index + product.product_id}>
                              <li
                                  key={product.product_name}
                                  onClick={() => handleSelectProduct(product)}
                                  className="cursor-pointer bg-sub-background pl-7 text-sm  hover:bg-sub hover:text-primary flex gap-3"
                              >
                                  <img
                                      src={
                                          product?.image ||
                                          "https://shelf-hawk-web-1.s3.amazonaws.com/shelf-hawk-web-1/storage/products/images/default.jpg"
                                      }
                                      className="w-10 h-10"
                                  />
                                  <div>
                                      <b>{product.product_name}</b>
                                      <div className="max-w-[80%] text-ellipsis">
                                          {product.item_description ?? ""}
                                      </div>
                                  </div>
                              </li>
                              {index != list.length - 1 && (
                                  <hr className="p-0 my-1" />
                              )}
                          </React.Fragment>
                      ))}
            </ul>
        </div>
    );
};

const FormTransferOrder = ({
    handleCloseModal,
    locations,
    products,
}: {
    handleCloseModal: CallableFunction;
    locations: Setups[];
    products: Products[];
}) => {
    const { data, setData } = useForm<{
        location_start: number;
        location_end: number;
        products: {
            [id: string]: { product_id: string; quantity: number; sku: string };
        };
    }>({
        products: {},
        location_start: locations[0]?.location_id ?? 1,
        location_end: locations[0]?.location_id ?? 1,
    });
    // Filter product base on locations
    const filterProduct: Products[] = products.filter((product) => {
        const location_list = JSON.parse(product.locations);
        if (
            _.some(
                location_list,
                (item) => item.location_id === data.location_start
            )
        )
            return product;
    });
    const dispatch = useDispatch();
    const [selectedProduct, setSelectedProduct] = useState<Products[]>([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(openLoading());
        if (!_.isEmpty(data.products)) {
            axios
                .post("/products/transfer", data)
                .then((res) => {
                    handleCloseModal();
                    showToast(res.data);
                    window.location.reload();
                    dispatch(closeLoading());
                })
                .catch((err) => {
                    // console.log(err);
                    handleCloseModal();
                    showToast(err.response.data);
                    dispatch(closeLoading());
                });
        }
    };
    const handleCancle = (e) => {
        e.preventDefault();
        handleCloseModal();
    };
    const handleAddProduct = (product) => {
        setSelectedProduct([...selectedProduct, product]);
    };
    return (
        <form onSubmit={handleSubmit} className="gap-2 grid">
            <div className="form-item grid grid-cols-2 grid-flow-row gap-1">
                <span>
                    <div className="block capitalize pb-1 pl-2">
                        <Label
                            htmlFor="location_start"
                            value="Location start"
                        />
                    </div>
                    <Select
                        id="location_start"
                        className="bg-sub-background"
                        onChange={(e) => {
                            setData("location_start", parseInt(e.target.value));
                            setSelectedProduct(
                                selectedProduct.filter((product) => {
                                    if (
                                        _.some(
                                            JSON.parse(product.locations),
                                            (item) =>
                                                item.location_id ===
                                                parseInt(e.target.value)
                                        )
                                    )
                                        return product;
                                })
                            );
                        }}
                        value={data.location_start}
                    >
                        {locations.map((location) => (
                            <option
                                key={`${location.location_id}` + "-start"}
                                value={location.location_id}
                            >
                                {location.location_name}
                            </option>
                        ))}
                    </Select>
                </span>
                <span>
                    <div className="block capitalize pb-1 pl-2">
                        <Label htmlFor="location_end" value="Location end" />
                    </div>
                    <Select
                        className="bg-sub-background"
                        value={data.location_end}
                        onChange={(e) =>
                            setData("location_end", parseInt(e.target.value))
                        }
                    >
                        {locations.map((location) => (
                            <option
                                key={`${location.location_id}` + "-end"}
                                value={location.location_id}
                            >
                                {location.location_name}
                            </option>
                        ))}
                    </Select>
                </span>
            </div>
            <ul>
                {selectedProduct.map((product) => (
                    <li
                        className=" border-y-[1px] py-3 flex justify-between items-center px-3 md:px-10"
                        key={`${product.product_id}-selected`}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={
                                    product?.image ||
                                    "https://shelf-hawk-web-1.s3.amazonaws.com/shelf-hawk-web-1/storage/products/images/default.jpg"
                                }
                                className="w-10 h-10"
                            />
                            <div>
                                <p className="text-sm md:text-base">
                                    {product.product_name}
                                </p>
                                <p className="text-xsm">
                                    {product.item_description}
                                </p>
                            </div>
                        </div>
                        <div>
                            <input
                                className="w-20 border border-opacity-20"
                                type="number"
                                onChange={(e) => {
                                    parseInt(e.target.value) < 0 &&
                                        (e.target.value = "0");
                                    setData("products", {
                                        ...data.products,
                                        [product.product_id]: {
                                            product_id: product.product_id,
                                            quantity:
                                                parseInt(e.target.value) < 0
                                                    ? 0
                                                    : parseInt(e.target.value),
                                            sku: product.sku ?? "",
                                        },
                                    });
                                }}
                                required
                            />
                            <button
                                className="text-danger hover:text-[var(--danger-button-hover)]"
                                onClick={() => {
                                    setSelectedProduct(
                                        _.reject(selectedProduct, {
                                            product_id: product.product_id,
                                        })
                                    );
                                    setData(
                                        "products",
                                        _.omit(
                                            data.products,
                                            product.product_id
                                        )
                                    );
                                }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <ProductList
                products={filterProduct}
                selectedProduct={selectedProduct}
                handleSelectProduct={handleAddProduct}
            />
            <hr />
            <div className="flex flex-row-reverse">
                <button
                    type="submit"
                    className="bg-info"
                    disabled={_.isEmpty(data.products)}
                >
                    submit
                </button>
                <button className="bg-danger" onClick={handleCancle}>
                    cancel
                </button>
            </div>
        </form>
    );
};
export default FormTransferOrder;
