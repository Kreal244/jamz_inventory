import { Products } from "@/types";
import { TableProps } from "@/types/components";
import _ from "lodash";
import { useState } from "react";
import Drawer from "./Drawer";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
const Table = ({
    cols,
    data = [],
    handleEdit,
    style,
    className,
    enableClick = false,
    drawerComponent = () => {},
    type = "default",
}: TableProps) => {
    type DrawerType = {
        open: boolean;
        item: any;
    };
    const dispatch = useDispatch();
    const [toggle, setToggle] = useState<DrawerType>({
        open: false,
        item: {},
    });
    const handleOpen = (item: Products) => {
        handleClose();
        setTimeout(() => {
            setToggle({ open: true, item: item });
        }, 100);
    };
    const handleClose = () => {
        setToggle({ open: false, item: {} as Products });
    };
    const header = {
        default: "",
        product: "SKU: " + toggle.item["sku_10digits"],
    };

    return (
        <>
            <div className="px-5 pb-5 mt-5 text-xsm relative overflow-x-auto overflow-y-auto max-h-[73vh]">
                <table
                    className={`table max-md:w-full h-full text-sm text-left rtl:text-right ${className}`}
                    style={style}
                >
                    <thead className="tb-header capitalize sticky z-10 top-[-1px]">
                        <tr key={"table-header"} className="truncate py-3">
                            {cols.map((item) => (
                                <th
                                    key={item.colName + item.shortcut}
                                    scope="col"
                                >
                                    {item.colName}
                                </th>
                            ))}
                            {handleEdit && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody className="tb-body">
                        {_.isEmpty(data) ? (
                            <tr className="text-center">
                                <td colSpan={cols.length}>There is no data.</td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={JSON.stringify(item)}
                                    onClick={() => {
                                        handleOpen(item);
                                    }}
                                >
                                    {cols.map((cell) => (
                                        <td
                                            key={`${JSON.stringify(item)}-${
                                                cell.shortcut
                                            }`}
                                            className="truncate"
                                        >
                                            {item[cell.shortcut]}
                                        </td>
                                    ))}
                                    {handleEdit && (
                                        <td
                                            className="p-auto"
                                            key={
                                                "action-" + JSON.stringify(item)
                                            }
                                        >
                                            <button
                                                className="bg-link"
                                                onClick={() =>
                                                    handleEdit(
                                                        JSON.stringify(item)
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {enableClick && (
                <Drawer show={toggle.open} header={header[type]}>
                    {drawerComponent(toggle.item, handleClose)}
                </Drawer>
            )}
        </>
    );
};
export default Table;
