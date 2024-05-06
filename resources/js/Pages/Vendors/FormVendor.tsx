import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Label, TextInput } from "flowbite-react";
import showToast from "@/util/showToast";

const FormVendor = ({
    handleCloseModal,
}: {
    handleCloseModal: CallableFunction;
}) => {
    const { data, setData } = useForm({
        vendor: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/setup/create", data).then((res) => {
            handleCloseModal();
            showToast(res.data);
        });
    };
    const handleCancle = (e) => {
        e.preventDefault();
        handleCloseModal();
    };
    return (
        <form onSubmit={handleSubmit} className="gap-2 grid">
            <div className="form-item">
                <div className="block">
                    <Label
                        htmlFor="vendor"
                        value="vendor name"
                        className="capitalize"
                    />
                </div>
                <TextInput
                    id="vendor"
                    type="text"
                    onBlur={(e) => setData("vendor", e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="flex flex-row-reverse">
                <button
                    type="submit"
                    className="bg-info"
                    disabled={data.vendor.length <= 0}
                >
                    submit
                </button>
                <button className="bg-danger" onClick={handleCancle}>
                    cancel
                </button>
            </div>
        </form>
    );
};
export default FormVendor;
