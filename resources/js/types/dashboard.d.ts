export type ListItems = {
    title: string;
    icon: any;
    color: string;
    dropdown: Array<{
        name: string;
        route: any;
        callback?: CallableFunction;
    }>;
    features: Array<{
        id?: string;
        name?: string;
        route?: any;
        callback?: CallableFunction;
        divider?: React.ReactNode;
    }>;
};
export interface DashboardParty {
    firstPart?: {
        listItems: ListItems[];
    };
}
