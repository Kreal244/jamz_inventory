import { ModalProps } from "@/types/components";
import { Modal } from "flowbite-react";
import { PropsWithChildren } from "react";
const FormModal = ({
    name,
    size="2xl",
    show = false,
    children,
    handleCloseModal = () => {},
}: PropsWithChildren<ModalProps>) => {
    return (
        <Modal
            show={show}
            size={size}
            onClose={handleCloseModal}
            className="bg-cover"
        >
            <div className="bg-sub-background rounded-md">
                <Modal.Header
                    className="uppercase"
                    theme={{ close: { icon: "h-0 w-0" }}}
                >
                    {name}
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
            </div>
        </Modal>
    );
};
export default FormModal;
