import { Select } from "flowbite-react";
import { useState, PropsWithChildren } from "react";
import * as dataType from "../../../asset/data/type.json";
import { useDispatch } from "react-redux";
import { closeModal } from "@/redux/reducers/ioFileReducer";
import _ from "lodash";
const ExportFile = ({
    exportType,
}: PropsWithChildren<{ exportType?: string }>) => {
    const [type, setType] = useState(dataType.exportTypes[0]);
    const dispatch = useDispatch();
    const handleCloseModal = () => {
        dispatch(closeModal());
    };
    return (
        <div className="bg-sub-background xsm:text-xsm md:text-sm p-4 grid gap-2">
            <h1 className="font-bold text-center">Export data</h1>
            <p>Please choose the type of data you want to export.</p>
            <div
                className="divider"
                style={{ borderColor: "var(--sub-color)" }}
            ></div>
            <div>
                <div className="flex items-baseline">
                    <b>Data type</b>
                    {_.isEmpty(exportType) && (
                        <Select
                            id="data-type"
                            className="ml-4"
                            onChange={(event) =>
                                setType(
                                    dataType.exportTypes[event.target.value]
                                )
                            }
                        >
                            {dataType.exportTypes.map((item, index) => (
                                <option key={item.value} value={index}>
                                    {item.value}
                                </option>
                            ))}{" "}
                        </Select>
                    )}
                </div>
                <p className="px-4 py-2">{type.description}</p>
            </div>
            <div
                className="divider"
                style={{ borderColor: "var(--sub-color)" }}
            ></div>
            <div className="flex flex-row-reverse">
                <button className="bg-info btn-sm">accept</button>
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
export default ExportFile;
