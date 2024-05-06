import { useForm } from "@inertiajs/react";
import axios from "axios";
import {
    Label,
    Select,
    TextInput,
    Textarea,
    Checkbox,
    Dropdown,
} from "flowbite-react";
import showToast from "@/util/showToast";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
import InputImage from "@/Components/InputImage";
import { useReducer, useState } from "react";
import _ from "lodash";

const FormProduct = ({
    handleCloseModal,
}: {
    handleCloseModal: CallableFunction;
}) => {
    const reDispatch = useDispatch();
    const mockLocation = [{ location: "Stocked" }, { location: "Non-Stocked" }];
    const mockPricingScheme = [
        {
            pricing: "normal price",
            currency: "USD",
            is_check: false,
        },
        {
            pricing: "usd",
            currency: "USD",
            is_check: false,
        },
    ];
    const [location, setLocation] = useState<{ location: string }[]>([]);
    const [pricingScheme, setPricingScheme] = useState(mockPricingScheme);
    const [modal, setModal] = useState({ is_open: false, type: "" });
    const reducer = (state, action) => {
        const init = _.omit(state, "total");
        console.log(init);
        const total = _.sum(_.values({ ...init, ...action }));
        return {
            ...init,
            ...action,
            total: total,
        };
    };
    const [state, dispatch] = useReducer(reducer, { total: 0 });
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
        material: "",
        material_2: "",
        hts_code: "",
        hts_tax: "",
        brand: "",
        case: "",
        number_per_case: "",
        vendor_express: "",
        box_style: "",
        packaging: "",
        type: productType[0].value,
        name: "",
        image: {} as File,
    });
    const handleImport = (e) => {
        setData("image", e.target.files[0]);
        console.log(data);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.name.length > 0) {
            reDispatch(openLoading());
            // axios.post("/setup/create", data).then((res) => {
            //     handleCloseModal();
            //     showToast(res.data);
            // });
        }
    };
    // const closeModal = () => {
    //      setModal((prev) => {
    //                     return { ...prev, is_open: false, type: "" };
    //                 })
    //  }
    const handleCancle = (e) => {
        e.preventDefault();
        handleCloseModal();
    };
    //     const FormChild = (type) => {
    //        const children={
    //            "location": <></>,
    //            "pricingScheme": <></>
    //        }
    // };

    return (
        <>
            <form onSubmit={handleSubmit} className="gap-2">
                <div className="grid gap-4 grid-cols-2 max-md:grid-cols-1 ">
                    <div className="px-3">
                        <InputImage handleImport={handleImport} />
                        <div className="form-item">
                            <Label htmlFor="description" value="description" />
                            <Textarea
                                id="description"
                                name="description"
                                onBlur={(e) => setData("name", e.target.value)}
                                required
                                placeholder="Description of product..."
                                rows={4}
                                maxLength={200}
                            />
                        </div>
                    </div>
                    <div className="gap-y-2 pr-2">
                        <div className="form-item">
                            <Label
                                htmlFor="product_name"
                                value="product name"
                            />
                            <TextInput
                                id="product_name"
                                type="text"
                                name="product_name"
                                required
                                onBlur={(e) =>
                                    e.target.value.length > 0 &&
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="form-item">
                            <Label
                                htmlFor="product_type"
                                value="product type"
                            />
                            <Select
                                name="type"
                                id="product_type"
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            >
                                {productType.map((item) => (
                                    <option value={item.value} key={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="form-item-only-input grid gap-1 grid-cols-2 lg:grid-cols-3">
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Material"
                                onBlur={(e) =>
                                    setData("material", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Material 2"
                                onBlur={(e) =>
                                    setData("material_2", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="HTS Code"
                                onBlur={(e) =>
                                    setData("hts_code", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="HTS Tax"
                                onBlur={(e) =>
                                    setData("hts_tax", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Brand"
                                onBlur={(e) => setData("brand", e.target.value)}
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Case"
                                onBlur={(e) => setData("case", e.target.value)}
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Number Per Case"
                                onBlur={(e) =>
                                    setData("number_per_case", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Vendor Express"
                                onBlur={(e) =>
                                    setData("vendor_express", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Box Style"
                                onBlur={(e) =>
                                    setData("box_style", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Packaging"
                                onBlur={(e) =>
                                    setData("packaging", e.target.value)
                                }
                            />
                        </div>
                        <div></div>
                    </div>
                </div>
                <div className="grid gap-4 grid-cols-2 max-md:grid-cols-1 ">
                    <div className="">
                        <div className="panel-header">
                            <div>quantity</div>
                            <div>{state.total}</div>
                        </div>
                        <hr />
                        <div className="panel-body">
                            <table className="">
                                <thead>
                                    <tr>
                                        <th>Loaction</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!_.isEmpty(location) &&
                                        location.map((item) => {
                                            return (
                                                <tr key={item.location}>
                                                    <td>{item.location}</td>
                                                    <td className="flex justify-center">
                                                        <input
                                                            type="number"
                                                            name={item.location}
                                                            min={0}
                                                            placeholder="Number of product"
                                                            className="w-[50%] text-center border-0"
                                                            value={
                                                                state[
                                                                    item
                                                                        .location
                                                                ]
                                                            }
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                dispatch({
                                                                    [event
                                                                        .currentTarget
                                                                        .name]:
                                                                        parseInt(
                                                                            event
                                                                                .currentTarget
                                                                                .value
                                                                        ) | 0,
                                                                });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                        <div className="panel-footer">
                            <Dropdown
                                label="More locations"
                                className="bg-[var(--background-sub-color)]"
                            >
                                {mockLocation.map((item, index) => {
                                    return (
                                        <Dropdown.Item
                                            key={item.location}
                                            onClick={() => {
                                                setLocation((prev) => [
                                                    ...prev,
                                                    ..._.pullAt(
                                                        mockLocation,
                                                        index
                                                    ),
                                                ]);
                                            }}
                                        >
                                            {item.location}
                                        </Dropdown.Item>
                                    );
                                })}
                            </Dropdown>
                        </div>
                    </div>
                    <div className="panel">
                        <div className="panel-header">
                            <h2>PRICING & COST</h2>
                        </div>
                        <div className="panel-body">
                            {pricingScheme.map((item) => {
                                return (
                                    <div
                                        className="form-item-inline"
                                        key={`inline-${item.pricing.replaceAll(
                                            " ",
                                            "-"
                                        )}`}
                                    >
                                        <Label
                                            value="Normal price"
                                            htmlFor={`price-${item.pricing}`}
                                        />
                                        <TextInput
                                            id={`price-${item.pricing}`}
                                            type="text"
                                            value={"currency " + 0}
                                            required
                                            onChange={(e) =>
                                                console.log(e.target.value)
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="panel-footer"></div>
                    </div>
                </div>

                <div className="divider"></div>
                <div className="flex flex-row-reverse">
                    <button
                        type="submit"
                        className="bg-info"
                        disabled={data.name.length <= 0}
                    >
                        submit
                    </button>
                    <button className="bg-danger" onClick={handleCancle}>
                        cancel
                    </button>
                </div>
            </form>
        </>
    );
};
export default FormProduct;
