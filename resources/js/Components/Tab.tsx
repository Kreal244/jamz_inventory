import { TabsProps } from "@/types";
import { Tabs as FlowTabs } from "flowbite-react";
const Tabs = (data: TabsProps[]) => {
    return (
        <FlowTabs aria-label="Tabs with underline" style="underline">
            {data.map((item, index) => {
                return (
                    <FlowTabs.Item
                        active={item?.active}
                        disabled={item?.disabled}
                        title={item.name}
                        icon={item?.icon}
                    >
                        <main>{item.children}</main>
                    </FlowTabs.Item>
                );
            })}
        </FlowTabs>
    );
};
export default Tabs;
