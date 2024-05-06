import { PropsWithChildren, CSSProperties } from "react";
import ItemHeader from "./ItemHeader";
import { ListItems } from "@/types/dashboard";
const Partition = ({
    id,
    className,
    style,
    children,
    header,
}: PropsWithChildren<{
    className?: string;
    id?: string;
    style?: CSSProperties;
    header?: {
        title: string;
        icon: any;
        color: string;
        dropdown?: ListItems["dropdown"];
    };
}>) => {
    return (
        <div
            className={
                "bg-sub-background shadow-md mt-3 rounded-md " + className
            }
            id={id}
            style={style}
        >
            {header && (
                <ItemHeader
                    title={header?.title}
                    icon={header?.icon}
                    color={header?.color}
                    dropdown={header?.dropdown}
                />
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};
export default Partition;