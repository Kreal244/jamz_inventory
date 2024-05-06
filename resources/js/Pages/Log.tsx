import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";

const Log = ({ auth }: PageProps) => {
    return (<Authenticated user={auth.user}>
        <Head title="Logs" />

        <div>sale</div>
    </Authenticated>);
};
export default Log;
