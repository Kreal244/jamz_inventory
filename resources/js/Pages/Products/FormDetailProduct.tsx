import { useForm } from "@inertiajs/react";
import axios from "axios";
import {
    Label,
    Select,
    TextInput,
    Textarea,
    Button,
    Dropdown,
    Tabs,
} from "flowbite-react";
import showToast from "@/util/showToast";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
import InputImage from "@/Components/InputImage";
import { useEffect, useReducer, useState } from "react";
import _ from "lodash";
import { Products, ProductSetupXref, Setups } from "@/types";
import {
    productTypes,
    pricingSchemeTypes,
} from "../../../asset/data/type.json";
import { FaBan } from "react-icons/fa6";
import FormModal from "@/Components/FormModal";
import React from "react";
import ModalConfirm from "@/Components/ModalConfirm";

const FormDetailProduct = ({
    item,
    locations,
    handleClose = () => {},
}: {
    item: Products;
    handleClose?: () => void;
    locations: Setups[];
}) => {
    const [thumbnail, setThumbnail] = useState(item.image);
    //HOOK
    const reDispatch = useDispatch();
    const { data, setData } = useForm(item);
    const reducer = (state, action) => {
        const init = _.omit(state.locations, "total");
        const total = _.sum(_.values({ ...init, ...action }));
        return {
            locations: {
                ...init,
                ...action,
                total: total,
            },
        };
    };
    const [openConfirm, setOpenConfirm] = useState<{
        open: boolean;
        id?: string;
    }>({ open: false, id: item.product_id });

    // LOCATION
    const [location, setLocation] = useState<ProductSetupXref[]>(
        JSON.parse(item.locations) || []
    );
    const productLocation = JSON.parse(item.locations) as Array<any>;
    const defautProductLocation: object = {};

    !_.isEmpty(productLocation) &&
        productLocation.forEach((p) =>
            _.merge(defautProductLocation, { [p.location_id]: p.quantity })
        );
    const [state, dispatch] = useReducer(reducer, {
        locations: {
            ...defautProductLocation,
            total: _.sumBy(productLocation, (p) => p?.quantity),
        },
    });
    const [opendDescription, setOpendDescription] = useState<{
        item_description: boolean;
        export_description: boolean;
        packaging_description: boolean;
        item_description_on_fda_pn_filing: boolean;
        socal_description: boolean;
        buyer_description: boolean;
    }>({
        item_description: !data.item_description?.length,
        export_description: !data.export_description?.length,
        packaging_description: !data.packaging_description?.length,
        item_description_on_fda_pn_filing:
            !data.item_description_on_fda_pn_filing?.length,
        socal_description: !data.socal_description?.length,
        buyer_description: !data.buyer_description?.length,
    });
    //
    // VariableF
    const locationList = _.differenceBy(
        locations,
        location,
        "location_id"
    ) as ProductSetupXref[];
    // const pricingSchemeList = _.differenceWith(
    //     pricingSchemeTypes,
    //     pricingScheme,
    //     _.isEqual
    // );

    //

    const handleImport = (file: File, callback?: CallableFunction) => {
        // Handle import image
        const formData = new FormData();
        formData.append("file", file);
        reDispatch(openLoading());
        axios
            .post(`/products/import_image/${item.product_id}`, formData)
            .then((res) => {
                setThumbnail(
                    "https://shelf-hawk-web-1.s3.amazonaws.com/shelf-hawk-web-1/" +
                        res.data.url
                );
                setData(
                    "image",
                    "https://shelf-hawk-web-1.s3.amazonaws.com/shelf-hawk-web-1/" +
                        res.data.url
                );
                if (callback) {
                    callback(Math.random() * 10 + 1);
                }
                reDispatch(closeLoading());
            });
    };
    const handleDelete = (id?: string) => {
        //Handle pop up confirm delete product
        if (!id) return;
        setOpenConfirm({ open: true, id: id });
    };
    const handleSubmit = (e) => {
        //Handle update product
        e.preventDefault();
        reDispatch(openLoading());
        axios
            .post("/products/edit", {
                product_detail: data,
                location: _.omit(state.locations, "total"),
                // pricing: pricingValue,
            })
            .then((res) => {
                // console.log(res.data);
                reDispatch(closeLoading());
                handleClose();
                showToast(res.data);
                window.location.reload();
            })
            .catch((err) => {
                reDispatch(closeLoading());
                handleClose();
                showToast(err.response.data);
            });
    };
    const handleConfirmDelete = (id?: string) => {
        //Handle delete product
        if (!id) {
            setOpenConfirm({ open: false, id: undefined });
            return;
        }
        reDispatch(openLoading());
        axios
            .post("/products/delete", { id: id })
            .then((res) => {
                reDispatch(closeLoading());
                handleClose();
                showToast(res.data);
                window.location.reload();
            })
            .catch((err) => {
                reDispatch(closeLoading());
                showToast(err.response.data);
            });
    };
    const handleCancelDelete = () => {
        console.log("cancel");
        //Handle cancel delete product
        setOpenConfirm({ open: false, id: undefined });
    };
    const handleInputInt = (
        // Handle input number
        e:
            | React.ChangeEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLInputElement>,
        tag: keyof Products
    ) => {
        if (e.target.value.length > 0) {
            setData(
                tag,
                parseInt(e.target.value ?? 0) < 0 ? 0 : parseInt(e.target.value)
            );
        } else {
            setData(tag, undefined);
        }
    };
    const handleInputFloat = (
        // Handle input number type float
        e:
            | React.ChangeEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLInputElement>,

        tag: keyof Products
    ) => {
        if (e.target.value.length > 0) {
            setData(
                tag,
                parseFloat(e.target.value) < 0 ? 0 : parseFloat(e.target.value)
            );
        } else {
            setData(tag, undefined);
        }
    };
    const handleInputString = (
        // Handle input string
        e:
            | React.ChangeEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLInputElement>,

        tag: keyof Products
    ) => {
        e.target.value.length > 0
            ? setData(tag, e.target.value ?? "")
            : setData(tag, undefined);
    };
    return (
        <>
            <form className="gap-2" onSubmit={handleSubmit}>
                {/* General information*/}
                <div className="mb-3">
                    <div className="grid gap-4 grid-cols-2 max-md:grid-cols-1">
                        <div className="px-3 grid gap-5">
                            <InputImage
                                productName={data.product_name}
                                imageUrl={thumbnail ?? ""}
                                handleImport={handleImport}
                                className="mt-[6%]"
                            />
                        </div>
                        <div className="px-3 grid gap-1">
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
                                    value={data.product_name ?? ""}
                                    onChange={(e) =>
                                        handleInputString(e, "product_name")
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <Label
                                    htmlFor="product_sku10digits"
                                    value="SKU 10 digits"
                                />
                                <TextInput
                                    id="product_sku10digits"
                                    type="text"
                                    name="product_sku10digits"
                                    required
                                    value={data.sku_10digits ?? ""}
                                    maxLength={10}
                                    onChange={(e) =>
                                        handleInputString(e, "sku_10digits")
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <Label htmlFor="product_sku" value="SKU" />
                                <TextInput
                                    id="product_sku"
                                    type="text"
                                    name="product_sku"
                                    required
                                    value={data.sku ?? ""}
                                    maxLength={10}
                                    onChange={(e) =>
                                        handleInputString(e, "sku")
                                    }
                                />
                            </div>
                            <div className="form-item">
                                <Label
                                    htmlFor="product_category"
                                    value="category"
                                />
                                <TextInput
                                    id="product_category"
                                    type="text"
                                    name="product_category"
                                    value={data.category ?? ""}
                                    onChange={(e) =>
                                        handleInputString(e, "category")
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
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                >
                                    {productTypes.map((row) => (
                                        <option
                                            value={row.value}
                                            key={row.value}
                                        >
                                            {row.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <Tabs
                    style="fullWidth"
                    theme={{
                        tablist: {
                            tabitem: {
                                styles: {
                                    fullWidth: {
                                        active: { on: "bg-primary text-light" },
                                        base: "max-sm:text-xsm truncate",
                                    },
                                },
                            },
                        },
                    }}
                >
                    <Tabs.Item title="Description" className="truncate" active>
                        <div className="grid gap-4 grid-cols-2 max-md:grid-cols-1 px-3">
                            {/* Item description */}
                            <div className="form-item">
                                <Label
                                    htmlFor="item_description"
                                    value="item description"
                                    className="truncate"
                                />
                                {opendDescription.item_description ? (
                                    <Textarea
                                        id="item_description"
                                        name="item_description"
                                        value={data.item_description ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "item_description",
                                                e.target.value
                                            )
                                        }
                                        onBlur={() =>
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    item_description: false,
                                                };
                                            })
                                        }
                                        placeholder="Description of product..."
                                        rows={4}
                                        maxLength={200}
                                    />
                                ) : (
                                    <p
                                        className="cursor-pointer mt-3 pl-2 normal-case"
                                        onClick={() => {
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    item_description: true,
                                                };
                                            });
                                        }}
                                    >
                                        {data.item_description || (
                                            <div className="text-hover text-sm">
                                                Empty data
                                            </div>
                                        )}
                                    </p>
                                )}
                            </div>
                            {/* Export description */}
                            <div className="form-item">
                                <Label
                                    htmlFor="export_description"
                                    className="truncate"
                                    value="export description"
                                />
                                {opendDescription.export_description ? (
                                    <Textarea
                                        id="export_description"
                                        name="export_description"
                                        value={data.export_description ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "export_description",
                                                e.target.value
                                            )
                                        }
                                        onBlur={() =>
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    export_description: false,
                                                };
                                            })
                                        }
                                        placeholder="Description of product..."
                                        rows={4}
                                        maxLength={200}
                                    />
                                ) : (
                                    <p
                                        className="cursor-pointer mt-3 pl-2 normal-case"
                                        onClick={() => {
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    export_description: true,
                                                };
                                            });
                                        }}
                                    >
                                        {data.export_description || (
                                            <div className="text-hover text-sm">
                                                Empty data
                                            </div>
                                        )}
                                    </p>
                                )}
                            </div>
                            {/* Packaging description */}
                            <div className="form-item">
                                <Label
                                    htmlFor="packaging_description"
                                    className="truncate"
                                    value="packaging description"
                                />
                                {opendDescription.packaging_description ? (
                                    <Textarea
                                        id="packaging_description"
                                        name="packaging_description"
                                        value={data.packaging_description ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "packaging_description",
                                                e.target.value
                                            )
                                        }
                                        onBlur={() =>
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    packaging_description:
                                                        false,
                                                };
                                            })
                                        }
                                        placeholder="Description of product..."
                                        rows={4}
                                        maxLength={200}
                                    />
                                ) : (
                                    <p
                                        className="cursor-pointer mt-3 pl-2 normal-case"
                                        onClick={() => {
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    packaging_description: true,
                                                };
                                            });
                                        }}
                                    >
                                        {data.packaging_description || (
                                            <div className="text-hover text-sm">
                                                Empty data
                                            </div>
                                        )}
                                    </p>
                                )}
                            </div>
                            {/* Socal description */}
                            <div className="form-item">
                                <Label
                                    htmlFor="socal_description"
                                    className="truncate"
                                    value="Socal description"
                                />
                                {opendDescription.socal_description ? (
                                    <Textarea
                                        id="socal_description"
                                        name="socal_description"
                                        value={data.socal_description ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "socal_description",
                                                e.target.value
                                            )
                                        }
                                        onBlur={() =>
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    socal_description: false,
                                                };
                                            })
                                        }
                                        placeholder="Description of product..."
                                        rows={4}
                                        maxLength={200}
                                    />
                                ) : (
                                    <p
                                        className="cursor-pointer mt-3 pl-2 normal-case"
                                        onClick={() => {
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    socal_description: true,
                                                };
                                            });
                                        }}
                                    >
                                        {data.socal_description || (
                                            <div className="text-hover text-sm">
                                                Empty data
                                            </div>
                                        )}
                                    </p>
                                )}
                            </div>
                            {/* item description on fda pn filing */}
                            <div className="form-item">
                                <Label
                                    htmlFor="item_description_on_fda_pn_filing"
                                    className="truncate"
                                    value="item description on fda pn filing"
                                />
                                {opendDescription.item_description_on_fda_pn_filing ? (
                                    <Textarea
                                        id="item_description_on_fda_pn_filing"
                                        name="item_description_on_fda_pn_filing"
                                        value={
                                            data.item_description_on_fda_pn_filing ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "item_description_on_fda_pn_filing",
                                                e.target.value
                                            )
                                        }
                                        onBlur={() =>
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    item_description_on_fda_pn_filing:
                                                        false,
                                                };
                                            })
                                        }
                                        placeholder="Description of product..."
                                        rows={4}
                                        maxLength={200}
                                    />
                                ) : (
                                    <p
                                        className="cursor-pointer mt-3 pl-2 normal-case"
                                        onClick={() => {
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    item_description_on_fda_pn_filing:
                                                        true,
                                                };
                                            });
                                        }}
                                    >
                                        {data.item_description_on_fda_pn_filing || (
                                            <div className="text-hover text-sm">
                                                Empty data
                                            </div>
                                        )}
                                    </p>
                                )}
                            </div>
                            {/* item description on fda pn filing */}
                            <div className="form-item">
                                <Label
                                    htmlFor="buyer_description"
                                    className="truncate"
                                    value="buyer description"
                                />
                                {opendDescription.buyer_description ? (
                                    <Textarea
                                        id="buyer_description"
                                        name="buyer_description"
                                        value={data.buyer_description ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "buyer_description",
                                                e.target.value
                                            )
                                        }
                                        onBlur={() =>
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    buyer_description: false,
                                                };
                                            })
                                        }
                                        placeholder="Description of product..."
                                        rows={4}
                                        maxLength={200}
                                    />
                                ) : (
                                    <p
                                        className="cursor-pointer mt-3 pl-2 normal-case"
                                        onClick={() => {
                                            setOpendDescription((prev) => {
                                                return {
                                                    ...prev,
                                                    buyer_description: true,
                                                };
                                            });
                                        }}
                                    >
                                        {data.buyer_description || (
                                            <div className="text-hover text-sm">
                                                Empty data
                                            </div>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Tabs.Item>
                    <Tabs.Item className="truncate" title=" Item detail">
                        <div className="form-item-only-input item-input grid gap-2 grid-cols-2 lg:grid-cols-3 mt-4 px-3">
                            {/* Product Information */}
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Material"
                                value={data.material ?? ""}
                                onChange={(e) =>
                                    setData("material", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Material 2 Export Category"
                                value={data.material_2_export_category ?? ""}
                                onChange={(e) =>
                                    setData(
                                        "material_2_export_category",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Standard or Large Amazon"
                                value={data.standard_or_large_amazon ?? ""}
                                onChange={(e) =>
                                    setData(
                                        "standard_or_large_amazon",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Purchased Pieces in a Set"
                                value={data.purchased_pieces_in_a_set}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "purchased_pieces_in_a_set"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Weight Unboxed (kg)"
                                value={data.weight_unboxed_kg}
                                onChange={(e) =>
                                    handleInputFloat(e, "weight_unboxed_kg")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Weight Unboxed (lb)"
                                value={data.weight_unboxed_lb}
                                onChange={(e) =>
                                    handleInputFloat(e, "weight_unboxed_lb")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Packaging Weight (kg)"
                                value={data.packaging_weight_kg}
                                onChange={(e) =>
                                    handleInputFloat(e, "packaging_weight_kg")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Packaged Weight Total (kg)"
                                value={data.packaged_weight_total_kg}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "packaged_weight_total_kg"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Packaged Individual Boxed Weight (lb)"
                                value={data.packaged_individual_boxed_weight_lb}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "packaged_individual_boxed_weight_lb"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Length Item (cm) Actual"
                                value={data.length_item_cm_actual}
                                onChange={(e) =>
                                    handleInputFloat(e, "length_item_cm_actual")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Width Item Actual (cm)"
                                value={data.width_item_actual_cm}
                                onChange={(e) =>
                                    handleInputFloat(e, "width_item_actual_cm")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Height Item (cm) Actual"
                                value={data.height_item_cm_actual}
                                onChange={(e) =>
                                    handleInputFloat(e, "height_item_cm_actual")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Length Item (in) Actual"
                                value={data.length_item_in_actual}
                                onChange={(e) =>
                                    handleInputFloat(e, "length_item_in_actual")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Width Item Actual (in)"
                                value={data.width_item_actual_in}
                                onChange={(e) =>
                                    handleInputFloat(e, "width_item_actual_in")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Height Item (in) Actual"
                                value={data.height_item_in_actual}
                                onChange={(e) =>
                                    handleInputFloat(e, "height_item_in_actual")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Length Longest (cm) Boxed"
                                value={data.length_longest_cm_boxed}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "length_longest_cm_boxed"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Width (cm) Boxed"
                                value={data.width_cm_boxed}
                                onChange={(e) =>
                                    handleInputFloat(e, "width_cm_boxed")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Length (in) Packaged"
                                value={data.length_in_packaged}
                                onChange={(e) =>
                                    handleInputFloat(e, "length_in_packaged")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Width (in) Packaged"
                                value={data.width_in_packaged}
                                onChange={(e) =>
                                    handleInputFloat(e, "width_in_packaged")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Depth Height (in) Packaged"
                                value={data.depth_height_in_packaged}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "depth_height_in_packaged"
                                    )
                                }
                            />
                            <input
                                type="number"
                                className="input-text"
                                placeholder="Dimensional Weight as lbs"
                                value={data.dimensional_weight_as_lbs}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "dimensional_weight_as_lbs"
                                    )
                                }
                            />

                            <input
                                type="date"
                                className="input-text"
                                placeholder="Date Entered Inventory"
                                value={data.date_entered_inventory ?? ""}
                                onChange={(e) =>
                                    setData(
                                        "date_entered_inventory",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Packaging"
                                value={data.packaging ?? ""}
                                onChange={(e) =>
                                    setData("packaging", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Box Grade"
                                value={data.box_grade ?? ""}
                                onChange={(e) =>
                                    setData("box_grade", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Box Style Model"
                                value={data.box_style_model ?? ""}
                                onChange={(e) =>
                                    setData("box_style_model", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Box Structure"
                                value={data.box_structure ?? ""}
                                onChange={(e) =>
                                    setData("box_structure", e.target.value)
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Depth Height cm Boxed"
                                value={data.depth_height_cm_boxed}
                                onChange={(e) =>
                                    handleInputFloat(e, "depth_height_cm_boxed")
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Volume Held oz"
                                value={data.volume_held_oz ?? ""}
                                onChange={(e) =>
                                    setData("volume_held_oz", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Proposed Branding"
                                value={data.proposed_branding ?? ""}
                                onChange={(e) =>
                                    setData("proposed_branding", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Seller Shipper Code"
                                value={data.seller_shipper_code ?? ""}
                                onChange={(e) =>
                                    setData(
                                        "seller_shipper_code",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Case Barcode"
                                value={data.case_barcode ?? ""}
                                onChange={(e) =>
                                    setData("case_barcode", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra Sticker Requirements"
                                value={data.extra_sticker_requirements ?? ""}
                                onChange={(e) =>
                                    setData(
                                        "extra_sticker_requirements",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Barcode FNSKU"
                                value={data.barcode_fnsku ?? ""}
                                onChange={(e) =>
                                    setData("barcode_fnsku", e.target.value)
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="UPC GTIN"
                                value={data.upc_gtin}
                                onChange={(e) =>
                                    handleInputFloat(e, "upc_gtin")
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="ASIN"
                                value={data.asin ?? ""}
                                onChange={(e) =>
                                    setData("asin", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Amazon SKU"
                                value={data.amazon_sku ?? ""}
                                onChange={(e) =>
                                    setData("amazon_sku", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Case"
                                value={data.case ?? ""}
                                onChange={(e) =>
                                    setData("case", e.target.value)
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Per Case"
                                value={data.per_case}
                                onChange={(e) =>
                                    handleInputFloat(e, "per_case")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Sampling Sale USA"
                                value={data.sampling_sale_usa}
                                onChange={(e) =>
                                    handleInputFloat(e, "sampling_sale_usa")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Wholesale for Sale USA Estimate"
                                value={data.wholesale_for_sale_usa_estimate}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "wholesale_for_sale_usa_estimate"
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Shipment Method"
                                value={data.shipment_method ?? ""}
                                onChange={(e) =>
                                    setData("shipment_method", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="HTS Code"
                                value={data.hts_code ?? ""}
                                onChange={(e) =>
                                    setData("hts_code", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Species"
                                value={data.species ?? ""}
                                onChange={(e) =>
                                    setData("species", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="HTS Tax"
                                value={data.hts_tax ?? ""}
                                onChange={(e) =>
                                    setData("hts_tax", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="FDA Product Code"
                                value={data.fda_product_code ?? ""}
                                onChange={(e) =>
                                    setData("fda_product_code", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Weight Per One"
                                value={data.weight_per_one ?? ""}
                                onChange={(e) =>
                                    setData("weight_per_one", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="PN Number"
                                value={data.pn_number ?? ""}
                                onChange={(e) =>
                                    setData("pn_number", e.target.value)
                                }
                            />
                        </div>
                    </Tabs.Item>
                    <Tabs.Item className="truncate" title="Pricing & Quantity">
                        <div className="form-item-only-input item-input grid gap-2 grid-cols-2 lg:grid-cols-3 mt-4 px-3">
                            {/* Pricing Information */}
                            <input
                                type="number"
                                className="input-text"
                                placeholder="Price of 1 CTS Box THB"
                                value={data.price_of_1_cts_box_thb}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "price_of_1_cts_box_thb"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Charged Shipping Weight Dimensional vs Actual"
                                value={
                                    data.charged_shipping_weight_dimensional_vs_actual
                                }
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "charged_shipping_weight_dimensional_vs_actual"
                                    )
                                }
                            />
                            <input
                                type="number"
                                className="input-text"
                                placeholder="Wholesale No Extra Packaging per Item"
                                value={
                                    data.wholesale_no_extra_packaging_per_item
                                }
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "wholesale_no_extra_packaging_per_item"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Wholesale Price per Piece THB"
                                value={data.wholesale_price_per_piece_thb}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "wholesale_price_per_piece_thb"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Wholesale Baht as Set"
                                value={data.wholesale_baht_as_set}
                                onChange={(e) =>
                                    handleInputFloat(e, "wholesale_baht_as_set")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Pankesum Price"
                                value={data.pankesum_price}
                                onChange={(e) =>
                                    handleInputFloat(e, "pankesum_price")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Customer Price USD"
                                value={data.customer_price_usd}
                                onChange={(e) =>
                                    handleInputFloat(e, "customer_price_usd")
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Wholesale Catalog for Thailand per Piece"
                                value={
                                    data.wholesale_catalog_for_thailand_per_piece
                                }
                                onChange={(e) =>
                                    setData(
                                        "wholesale_catalog_for_thailand_per_piece",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Faire Price"
                                value={data.faire_price}
                                onChange={(e) =>
                                    handleInputFloat(e, "faire_price")
                                }
                            />
                        </div>
                        <hr className="my-5 p-0" />
                        <div className="grid gap-4  p-4">
                            <div className="panel">
                                <div className="panel-header">
                                    <h2>QUANTITY</h2>
                                    <div className="text-lg px-5 py-2">
                                        {state.locations.total}
                                    </div>
                                </div>
                                <hr />
                                <div className="panel-body">
                                    {!_.isEmpty(location) && (
                                        <table className="">
                                            <thead>
                                                <tr>
                                                    <th>Location</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {location.map((item) => {
                                                    return (
                                                        <tr
                                                            key={
                                                                item.location_id
                                                            }
                                                        >
                                                            <td className="truncate max-lg:max-w-28">
                                                                {
                                                                    item.location_name
                                                                }
                                                            </td>
                                                            <td className="flex justify-center">
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    placeholder="Number of product"
                                                                    className="w-[50%] text-center border-0"
                                                                    name={item.location_id?.toString()}
                                                                    value={
                                                                        (state
                                                                            .locations[
                                                                            item.location_id?.toString() ??
                                                                                ""
                                                                        ] ??
                                                                            item.quantity) |
                                                                        0
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) => {
                                                                        dispatch(
                                                                            {
                                                                                [event
                                                                                    .currentTarget
                                                                                    .name]:
                                                                                    parseInt(
                                                                                        event
                                                                                            .currentTarget
                                                                                            .value
                                                                                    ) |
                                                                                    0,
                                                                            }
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                <div className="panel-footer">
                                    <Dropdown
                                        label="More locations"
                                        className="bg-[var(--background-sub-color)]"
                                    >
                                        {_.isEmpty(locationList) ? (
                                            <div className="text-center">
                                                No more locations
                                            </div>
                                        ) : (
                                            locationList.map((item) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={item.location_id}
                                                        onClick={() => {
                                                            setLocation(
                                                                (prev) => [
                                                                    ...prev,
                                                                    item,
                                                                ]
                                                            );
                                                        }}
                                                    >
                                                        {item.location_name}
                                                    </Dropdown.Item>
                                                );
                                            })
                                        )}
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </Tabs.Item>
                    <Tabs.Item className="truncate" title="Other Fields">
                        <div className="form-item-only-input item-input grid gap-2 grid-cols-2 lg:grid-cols-3 mt-4 px-3">
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Manufacturer ID Number"
                                value={data.manufacturer_id_number}
                                onChange={(e) =>
                                    setData(
                                        "manufacturer_id_number",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Manufacturer Name"
                                value={data.manufacturer_name}
                                onChange={(e) =>
                                    setData("manufacturer_name", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Manufacturing Address"
                                value={data.manufacturing_address}
                                onChange={(e) =>
                                    setData(
                                        "manufacturing_address",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Manufacturer Owner Name"
                                value={data.manufacturer_owner_name}
                                onChange={(e) =>
                                    setData(
                                        "manufacturer_owner_name",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="number"
                                className="input-text"
                                placeholder="Max in Pallet"
                                value={data.max_in_pallet}
                                onChange={(e) =>
                                    handleInputInt(e, "max_in_pallet")
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="Cost of Delivering 1 Piece"
                                value={data.cost_of_delivering_1_piece}
                                onChange={(e) =>
                                    handleInputFloat(
                                        e,
                                        "cost_of_delivering_1_piece"
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="input-text"
                                placeholder="In Container 40 Pallets"
                                value={data.in_container_40_pallets}
                                onChange={(e) =>
                                    handleInputInt(e, "in_container_40_pallets")
                                }
                            />
                        </div>
                        <hr className="p-0 my-5" />
                        <div className="form-item-only-input item-input grid gap-2 grid-cols-2 lg:grid-cols-3 mt-4 px-3">
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 1"
                                value={data.extra1 ?? ""}
                                onChange={(e) =>
                                    setData("extra1", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 2"
                                value={data.extra2 ?? ""}
                                onChange={(e) =>
                                    setData("extra2", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 3"
                                value={data.extra3 ?? ""}
                                onChange={(e) =>
                                    setData("extra3", e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 4"
                                value={data.extra4}
                                onChange={(e) =>
                                    setData("extra4", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 5"
                                value={data.extra5}
                                onChange={(e) =>
                                    setData("extra5", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 6"
                                value={data.extra6}
                                onChange={(e) =>
                                    setData("extra6", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 7"
                                value={data.extra7}
                                onChange={(e) =>
                                    setData("extra7", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 8"
                                value={data.extra8}
                                onChange={(e) =>
                                    setData("extra8", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 9"
                                value={data.extra9}
                                onChange={(e) =>
                                    setData("extra9", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 10"
                                value={data.extra10}
                                onChange={(e) =>
                                    setData("extra10", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 11"
                                value={data.extra11}
                                onChange={(e) =>
                                    setData("extra11", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 12"
                                value={data.extra12}
                                onChange={(e) =>
                                    setData("extra12", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 13"
                                value={data.extra13}
                                onChange={(e) =>
                                    setData("extra13", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                className="input-text"
                                placeholder="Extra 14"
                                value={data.extra14}
                                onChange={(e) =>
                                    setData("extra14", e.target.value)
                                }
                            />
                        </div>
                    </Tabs.Item>
                </Tabs>
                <hr />
                <div className="flex justify-between max-sm:justify-start max-sm:flex-wrap mb-2 px-5 text-sm gap-2">
                    <button
                        className="text-danger hover:text-[var(--danger-button-hover)] w-28 pl-1 pr-3 border border-[var(--danger-button)] hover:border-[var(--danger-button-hover)] flex justify-center items-center text-sm"
                        onClick={() => handleDelete(item.product_id)}
                        type="button"
                    >
                        <FaBan className="mr-2 h-3 w-3" />
                        Delete
                    </button>
                    <span>
                        <button
                            className="bg-danger w-28 pl-2 pr-3 h-full text-sm"
                            type="button"
                            onClick={handleClose}
                        >
                            cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-info w-28 pl-2 pr-3 h-full text-sm"
                        >
                            submit
                        </button>
                    </span>
                </div>
            </form>
            <ModalConfirm
                open={openConfirm.open}
                message="Are you sure you want to delete this product?"
                onConfirm={() => handleConfirmDelete(openConfirm.id)}
                onCancel={handleCancelDelete}
            />
        </>
    );
};
export default FormDetailProduct;
