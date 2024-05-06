import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";

const Option = ({ auth }: PageProps) => {
    return (<Authenticated user={auth.user}>
        <Head title="Options" />

        <div>sale</div>
    </Authenticated>);
};
export default Option;
