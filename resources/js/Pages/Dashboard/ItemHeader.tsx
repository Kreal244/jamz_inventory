import { PropsWithChildren } from "react";
import { ListItems } from "@/types/dashboard";
import { Dropdown } from "flowbite-react";
import { FaPlus } from "react-icons/fa6";
import _ from "lodash";
const ItemHeader = ({
    title,
    icon,
    color,
    dropdown,
}: PropsWithChildren<{
    title: string;
    icon: any;
    color: string;
    dropdown?: ListItems["dropdown"];
}>) => {
    return (
        <div
            style={{ backgroundColor: color }}
            className="flex justify-between align-middle px-5 py-3 h-14 rounded-t-md "
        >
            <span className="flex items-center">
                <span className="text-2xl">{icon}</span>
                <span className="ml-4 uppercase">{title}</span>
            </span>
            {!_.isEmpty(dropdown) && (
                <Dropdown
                    label={<FaPlus />}
                    arrowIcon={false}
                    className="bg-[#ffffff]"
                >
                    {dropdown?.map((item) => (
                        <Dropdown.Item
                            href={item?.route}
                            key={item.name.toLocaleLowerCase()}
                            className="max-sm:text-[10px]"
                        >
                            <div
                                id={(item?.name ?? "")
                                    .toLocaleLowerCase()
                                    .replaceAll(" ", "_")}
                                onClick={(e) => {
                                    item?.callback?.(e.currentTarget.id);
                                }}
                            >
                                {item.name}
                            </div>
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            )}
        </div>
    );
};
export default ItemHeader;
