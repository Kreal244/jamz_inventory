import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Label, TextInput } from "flowbite-react";
import showToast from "@/util/showToast";
import { closeLoading, openLoading } from "@/redux/reducers/loadingReducer";
import { useDispatch } from "react-redux";
const FormLocation = ({
    handleCloseModal,
}: {
    handleCloseModal: CallableFunction;
}) => {
    const dispatch = useDispatch();
    const { data, setData } = useForm({
        location_name: "",
        address: "",
        state: "",
        city: "",
        country: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(openLoading());
        axios
            .post("/setup/create", data)
            .then((res) => {
                handleCloseModal();
                dispatch(closeLoading());
                window.location.reload();
            })
            .catch((err) => {
                handleCloseModal();
                dispatch(closeLoading());
                showToast(err.response.data);
            });
    };
    const handleCancle = (e) => {
        e.preventDefault();
        handleCloseModal();
    };
    return (
        <form onSubmit={handleSubmit} className="gap-2 grid">
            <div className="form-item">
                <Label htmlFor="location_name">Location Name</Label>
                <TextInput
                    type="text"
                    id="location_name"
                    name="location_name"
                    className="form-control"
                    required
                    onChange={(e) => setData("location_name", e.target.value)}
                />
            </div>
            <div className="form-item">
                <Label htmlFor="address">Address</Label>
                <TextInput
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    onChange={(e) => setData("address", e.target.value)}
                    required
                />
            </div>
            <div className="grid grid-cols-3 gap-1">
                <div className="form-item">
                    <Label htmlFor="city">City</Label>
                    <TextInput
                        type="text"
                        id="city"
                        name="city"
                        className="form-control"
                        onChange={(e) => setData("city", e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <Label htmlFor="state">State</Label>
                    <TextInput
                        type="text"
                        id="state"
                        name="state"
                        className="form-control"
                        onChange={(e) => setData("state", e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <Label htmlFor="country">Country</Label>
                    <TextInput
                        type="text"
                        id="country"
                        name="country"
                        className="form-control"
                        onChange={(e) => setData("country", e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-row-reverse">
                <button type="submit" className="bg-info">
                    submit
                </button>
                <button className="bg-danger" onClick={handleCancle}>
                    cancel
                </button>
            </div>
        </form>
    );
};
export default FormLocation;
