import React from "react";

export type HeaderProps = {
    style?: object;
    className?: string;
    children: React.ReactNode;
};

export type ColItem = { colName: string; shortcut: string; field?: string };
export type TableProps = {
    cols: ColItem[];
    data?: any[];
    handleEdit?: CallableFunction;
    style?: object;
    className?: string;
    enableClick?: boolean;
    drawerComponent?: CallableFunction;
    type?:
        | "product"
        | "order"
        | "location"
        | "setup"
        | "spreadsheet"
        | "transfer"
        | "default";
};
export type ModalProps = {
    name: string;
    show: boolean;
    size?:
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "4xl"
        | "5xl"
        | "6xl"
        | "7xl";
    handleSubmit?: CallableFunction;
    handleCloseModal?: () => void;
};
