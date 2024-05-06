import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Label, Select, TextInput, FloatingLabel } from "flowbite-react";
import showToast from "@/util/showToast";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
import InputImage from "@/Components/InputImage";
import { useReducer, useState } from "react";
import { productTypes } from "../../../asset/data/type.json";
import _ from "lodash";
// todo: Add input SKU field with required
const FormProduct = ({
    handleCloseModal,
}: {
    handleCloseModal: CallableFunction;
}) => {
    const reDispatch = useDispatch();
    const { data, setData } = useForm({
        product_name: "",
        type: productTypes[0].value,
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        reDispatch(openLoading());
        if (data.product_name.length > 0) {
            reDispatch(openLoading());
            axios.post("/products/create", data).then((res) => {
                handleCloseModal();
                reDispatch(closeLoading());
                const props = {
                    status: res.data.status,
                    message: res.data.message,
                };
                showToast(props);
                window.location.reload();
            });
        }
    };
    const handleCancle = (e) => {
        e.preventDefault();
        handleCloseModal();
    };

    return (
        <form onSubmit={handleSubmit} className="gap-2">
            <div className="form-item">
                <Label htmlFor="product_name" value="Name" />
                <TextInput
                    id="product_name"
                    type="text"
                    name="product_name"
                    required
                    onBlur={(e) => setData("product_name", e.target.value)}
                />
            </div>
            <div className="form-item">
                <Label htmlFor="product_type" value="product type" />
                <Select
                    name="type"
                    id="product_type"
                    onChange={(e) => setData("type", e.target.value)}
                >
                    {productTypes.map((item) => (
                        <option value={item.value} key={item.value}>
                            {item.name}
                        </option>
                    ))}
                </Select>
            </div>
            <hr />
            <div className="flex flex-row-reverse">
                <button
                    type="submit"
                    className="bg-info"
                    disabled={data.product_name.length <= 0}
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
export default FormProduct;
