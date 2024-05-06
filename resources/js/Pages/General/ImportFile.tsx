import InputFile from "@/Components/InputFile";
import { PropsWithChildren, useEffect, useState } from "react";
import { FaRegTrashCan, FaDownload } from "react-icons/fa6";
import { Select, Checkbox, Label } from "flowbite-react";
import _ from "lodash";
import * as dataType from "../../../asset/data/type.json";
import showToast from "@/util/showToast";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { closeModal } from "@/redux/reducers/ioFileReducer";
const ImportFile = ({
    type,
}: PropsWithChildren<{
    type?: string;
}>) => {
    const { auth } = usePage<PageProps>().props;

    const dispatch = useDispatch();
    const formData = new FormData();
    const [template, setTemplate] = useState({});
    const { data, setData } = useForm({
        type: type ? type : dataType.importTypes[0],
        file: {} as File,
        is_template: false,
    });
    useEffect(() => {
        dispatch(openLoading());
        axios.get(route("template")).then((res) => {
            setTemplate(res.data);
            dispatch(closeLoading());
        });
    }, []);
    const handleImport = (event) => {
        setData("file", event.target.files[0]);
    };
    const handleCloseModal = () => {
        dispatch(closeModal());
    };
    const handleSubmit = () => {
        dispatch(openLoading());
        formData.append("file", data.file);
        formData.append("type", data.type.toLowerCase().replaceAll(" ", "_"));
        formData.append("is_template", data.is_template ? "1" : "0");

        // console.log(data);
        if (!_.isEmpty(data.file?.name)) {
            axios
                .post(route("import"), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    dispatch(closeLoading());
                    showToast(res.data);
                    window.location.reload();
                })
                .catch((err) => {
                    dispatch(closeLoading());

                    showToast(err.response.data);
                })
                .finally(() => handleCloseModal());
        }
    };
    const handleDownload = (event) => {
        event.preventDefault();
        const type = data.type.toLowerCase().replaceAll(" ", "_");
        window.open(
            `https://shelf-hawk-web-1.s3.amazonaws.com/${template[type]}`
        );
    };
    return (
        <div className="bg-sub-background xsm:text-xsm md:text-sm px-6 py-4 grid gap-2 ">
            <h1 className="font-bold text-center">Import data</h1>
            <div>
                <p>
                    Shelf Hawk can import spreadsheet data if it's saved as a
                    CSV file.
                </p>
                <p className="mt-4">
                    If your spreadsheet is not in CSV format yet, you can use
                    Microsoft Excel or Google Sheets and save it as a CSV.
                    <a href="#" className="text-link ml-1">
                        Learn more
                    </a>
                </p>
            </div>
            <div
                className="divider"
                style={{ borderColor: "var(--sub-color)" }}
            ></div>

            <div>
                <div className="flex items-baseline">
                    <b>Data type</b>
                    {_.isEmpty(type) && (
                        <Select
                            id="data-type"
                            className="ml-4"
                            onChange={(event) => {
                                setData("type", event.target.value);
                            }}
                        >
                            {dataType.importTypes.map((item) => (
                                <option
                                    key={item.replaceAll(" ", "_")}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}{" "}
                        </Select>
                    )}
                </div>
                <div className="bg-sub-backgound mt-2">
                    <p className="text-sm px-1">
                        Need help getting started? Download our simple template.
                    </p>
                    {/* //TODO: change href download file */}
                    <button
                        onClick={(e) => handleDownload(e)}
                        className="text-link flex items-baseline gap-1"
                    >
                        <FaDownload /> Download {data.type} import template
                    </button>
                </div>
            </div>
            <div
                className="divider"
                style={{ borderColor: "var(--sub-color)" }}
            ></div>
            {_.isEmpty(data.file?.name) ? (
                <InputFile handleImport={handleImport} />
            ) : (
                <>
                    <div className="border flex justify-between rounded-lg p-1 pl-3">
                        <span>{data.file?.name}</span>
                        <button
                            className="text-danger"
                            onClick={() => {
                                setData("file", {} as File);
                            }}
                        >
                            <FaRegTrashCan />
                        </button>
                    </div>

                    {!!auth.user.is_admin && (
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox
                                id="template"
                                name="is_template"
                                onChange={(e) =>
                                    setData("is_template", !data.is_template)
                                }
                            />
                            <Label htmlFor="template">Upload template</Label>
                        </div>
                    )}
                </>
            )}
            <div
                className="divider"
                style={{ borderColor: "var(--sub-color)" }}
            ></div>
            <div className="flex flex-row-reverse">
                <button className="bg-info btn-sm" onClick={handleSubmit}>
                    accept
                </button>
                <button
                    className="bg-danger btn-sm"
                    onClick={() => {
                        handleCloseModal();
                    }}
                >
                    cancel
                </button>
            </div>
        </div>
    );
};
export default ImportFile;
