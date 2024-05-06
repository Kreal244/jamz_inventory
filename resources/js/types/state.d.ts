export type sidebarState = {
    sidebar: {
        isOpen: boolean;
    };
};
export type loadingState = {
    loading: {
        isOpen: boolean;
    };
};
export type toastState = {
    toast: {
        id: number;
        status: "info" | "success" | "failure" | "";
        message: string;
    };
};
export type authLayoutState = {
    modal: {
        isOpen?: boolean;
        type: string;
        dataType?: string;
    };
};
