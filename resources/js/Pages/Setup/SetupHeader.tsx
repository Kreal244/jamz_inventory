import Header from "@/Components/Header";
import { FaPlus } from "react-icons/fa6";
const SetupHeader = (props: { handleOpenModal: CallableFunction }) => {
    return (
        <Header>
            <div className="flex justify-between">
                <span className="uppercase text-lg font-bold">location</span>
                <button
                    className="bg-link flex items-center gap-1"
                    onClick={() => props?.handleOpenModal()}
                >
                    <FaPlus /> add new location
                </button>
            </div>
        </Header>
    );
};
export default SetupHeader;
