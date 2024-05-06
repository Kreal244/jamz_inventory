import { ListItems } from "@/types/dashboard";
import React, { PropsWithChildren } from "react";
import ItemHeader from "./ItemHeader";
import _ from "lodash";
const ItemField = ({ data }: PropsWithChildren<{ data: ListItems[] }>) => {
    return (
        <>
            {data.map((item) => {
                return (
                    <div
                        key={`${item.title.toLowerCase()}`}
                        id={`${item.title.toLowerCase()}`}
                        className="md:min-w-40"
                    >
                        <ItemHeader
                            title={item.title}
                            icon={item.icon}
                            color={item.color}
                            dropdown={item.dropdown}
                        />
                        <ul className="p-3 border">
                            {item.features.map((child, index) =>
                                _.isEmpty(child.divider) ? (
                                    <li
                                        key={`${item.title.toLowerCase()}-${index}`}
                                        className={"max-sm:text-sm py-3 pl-4 "}
                                    >
                                        <a
                                            href={child.route}
                                            id={(child?.name ?? "")
                                                .toLocaleLowerCase()
                                                .replaceAll(" ", "_")}
                                            onClick={(e) => {
                                                child?.callback?.(
                                                    e.currentTarget.id
                                                );
                                            }}
                                        >
                                            {child.name}
                                        </a>
                                    </li>
                                ) : (
                                    <React.Fragment
                                        key={`${item.title.toLowerCase()}-${index}-divider`}
                                    >
                                        {child.divider}
                                    </React.Fragment>
                                )
                            )}
                        </ul>
                    </div>
                );
            })}
        </>
    );
};
export default ItemField;
