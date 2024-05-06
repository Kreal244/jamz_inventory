import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Label, Select, Radio, Tabs, TextInput } from "flowbite-react";
import showToast from "@/util/showToast";
import { spreadsheet } from "../../../asset/data/structure.json";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
import { useDispatch } from "react-redux";
import { FaFilePen, FaFileMedical } from "react-icons/fa6";
import { useState } from "react";
import _ from "lodash";
import { SheetList } from "@/types";
const FormSpreadsheet = ({
    spreadsheets = {} as SheetList,
    handleCloseModal,
}: {
    handleCloseModal: CallableFunction;
    spreadsheets?: SheetList;
}) => {
    const dispatch = useDispatch();
    const filteredSpreadsheets = spreadsheet.filter((s) =>
        _.keys(spreadsheets).includes(s.value)
    );
    const { data, setData } = useForm({
        action: "pull",
        type: filteredSpreadsheets[0].value,
    });
    const [type, setSheetType] = useState(
        _.keys(spreadsheets)[0] ?? spreadsheet[0].value
    );
    const [sheetId, setSheetId] = useState(spreadsheets[type]?.sheet_id ?? "");
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(openLoading());
        axios.get(`spreadsheet/${data.action}/${data.type}`).then((res) => {
            dispatch(closeLoading());
            handleCloseModal();
            showToast(res.data);
        });
    };
    const handleCancle = (e) => {
        e.preventDefault();
        handleCloseModal();
    };
    const handleEdit = (e) => {
        e.preventDefault();
        dispatch(openLoading());
        axios
            .post(`spreadsheet/edit`, {
                sheet_type: type,
                sheet_id: sheetId,
                shared_email:
                    "shelf-hawk@sparkle-381608.iam.gserviceaccount.com",
            })
            .then((res) => {
                dispatch(closeLoading());
                handleCloseModal();
                showToast(res.data);
                window.location.reload();
            })
            .catch((err) => {
                dispatch(closeLoading());
                setError(err.response.data.message);
            });
    };
    return (
        <Tabs style="default" className="w-full">
            <Tabs.Item title="Settings" icon={FaFileMedical} active>
                <form
                    onSubmit={handleEdit}
                    className="text-sm max-md:text-xsm px-5 max-md:px-2"
                >
                    <div className="form-item ">
                        <Label value="Select type to integrate spreadsheet" />
                        <Select
                            onChange={(event) => {
                                setSheetType(event.target.value);
                                setSheetId(
                                    spreadsheets[event.target.value]
                                        ?.sheet_id ?? ""
                                );
                            }}
                            value={type}
                        >
                            {spreadsheet.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                    className="p-2"
                                >
                                    {item.type}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <hr className="py-1 pt-0" />
                    <div>
                        <p className="max-md:my-2 mt-4 mb-2">
                            Step 1: Create a blank sheet.
                        </p>
                        <p className="ml-12 mb-0 max-md:ml-3 max-md:text-[10px]">
                            <a
                                href="https://docs.google.com/spreadsheets"
                                target="_new"
                            >
                                <strong>
                                    Click here to go to Google Sheet
                                </strong>
                            </a>
                        </p>
                        <p className="max-md:my-2 mt-4 mb-2">
                            Step 2: Share the spreadsheet to our bot email as{" "}
                            <b>Editor</b>:
                        </p>
                        <p className="ml-12 mb-0 max-md:ml-3 max-md:text-[10px]">
                            <strong>
                                shelf-hawk@sparkle-381608.iam.gserviceaccount.com
                            </strong>
                        </p>
                        <p className="max-md:my-2 mt-4 mb-2">
                            Step 3: Rename your sheet's tab to "
                            <b>{_.find(spreadsheet, { value: type })?.type}</b>
                            ".
                        </p>
                        <p className="max-md:my-2 mt-4 mb-2">
                            Step 4: Copy your new <b>Sheet ID</b> into the
                            'Sheet ID' block below.
                        </p>
                        <h4 className="mt-4 text-primary font-bold ">
                            Information our system needs to Connect your sheet:
                        </h4>
                    </div>

                    <div className="form-item ">
                        <TextInput
                            value={sheetId}
                            onChange={(e) => setSheetId(e.target.value)}
                            onBlur={(e) => {
                                setError("");
                            }}
                        />
                        {!_.isElement(error) && (
                            <p className="text-danger pt-1 pl-3">{error}</p>
                        )}
                    </div>

                    <div className="divider"></div>
                    <div className="flex flex-row-reverse">
                        <button type="submit" className="bg-info">
                            submit
                        </button>
                        <button className="bg-danger" onClick={handleCancle}>
                            cancel
                        </button>
                    </div>
                </form>
            </Tabs.Item>
            <Tabs.Item title="Action" icon={FaFilePen}>
                <form onSubmit={handleSubmit} className="gap-2 grid">
                    <div className="form-item grid grid-cols-2">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-2">
                                <Radio
                                    id="pull"
                                    value={"pull"}
                                    checked={data.action === "pull"}
                                    onChange={(e) =>
                                        setData("action", e.currentTarget.value)
                                    }
                                />
                                <Label htmlFor="pull">Pull Data</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio
                                    id="push"
                                    value={"push"}
                                    checked={data.action === "push"}
                                    onChange={(e) =>
                                        setData("action", e.currentTarget.value)
                                    }
                                />
                                <Label htmlFor="push">Push Data</Label>
                            </div>
                        </div>
                        <div>
                            <Select
                                onChange={(event) =>
                                    setData("type", event.target.value)
                                }
                                value={data.type}
                            >
                                {filteredSpreadsheets.map((item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                        className="p-2"
                                    >
                                        {item.type}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="flex flex-row-reverse">
                        <button type="submit" className="bg-info">
                            submit
                        </button>
                        <button className="bg-danger" onClick={handleCancle}>
                            cancel
                        </button>
                    </div>
                </form>
            </Tabs.Item>
        </Tabs>
    );
};
export default FormSpreadsheet;
