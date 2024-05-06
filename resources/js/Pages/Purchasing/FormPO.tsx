import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Label, Select, TextInput } from "flowbite-react";
import showToast from "@/util/showToast";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";

const FormPO = ({
    handleCloseModal,
}: {
    handleCloseModal: CallableFunction;
    }) => {
    const dispatch = useDispatch();
    const productType = [
        {
            name: "Stocked Products (most common)",
            value: "stocked_product",
            describe: "",
        },
        {
            name: "Serialized Products ",
            value: "serialized_product",
            describe: "",
        },
        {
            name: "Non-stocked Products",
            value: "non_stocked_product",
            describe: "",
        },
        {
            name: "Service",
            value: "service",
            describe: "",
        },
    ];
    const { data, setData } = useForm({
        name: "",
        type: productType[0].value,
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.name.length > 0) {
            dispatch(openLoading());
            // axios.post("/setup/create", data).then((res) => {
            //     handleCloseModal();
            //     showToast(res.data);
            // });
        }
    };
    const handleCancle = (e) => {
        e.preventDefault();
        handleCloseModal();
    };
    return (
        <form onSubmit={handleSubmit} className="gap-2 grid">
            <div className="form-item">
                <div className="block capitalize">
                    <Label htmlFor="product_name" value="product name" />
                </div>
                <TextInput
                    id="product_name"
                    type="text"
                    name="product_name"
                    onBlur={(e) => setData("name", e.target.value)}
                    required
                />
            </div>
            <div className="form-item">
                <div className="block capitalize">
                    <Label htmlFor="product_type" value="product name" />
                </div>
                <Select name="type" onChange={(e)=>setData("type",e.target.value)}>
                    {productType.map((item) => (
                        <option value={item.value} key={item.value}>
                            {item.name}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="divider"></div>
            <div className="flex flex-row-reverse">
                <button type="submit" className="bg-info" disabled={data.name.length<=0}>
                    submit
                </button>
                <button className="bg-danger" onClick={handleCancle}>
                    cancel
                </button>
            </div>
        </form>
    );
};
export default FormPO;
