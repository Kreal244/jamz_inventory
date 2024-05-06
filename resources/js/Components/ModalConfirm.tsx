import { Modal, Button } from "flowbite-react";

const ModalConfirm = ({
    title = "Confirm",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    open,
    onConfirm,
    onCancel,
}: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    const handleCofirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onCancel();
    };
    return (
        <Modal
            show={open}
            size="md"
            popup
            className="bg-cover"
            onClose={onCancel}
        >
            <Modal.Header className="bg-sub-background pt-4 pl-6 text-center border-b">
                {title}
            </Modal.Header>
            <Modal.Body className="bg-sub-background pt-5">
                <div className="space-y-6">
                    <p className="text-base text-center leading-relaxed text-gray-500 dark:text-gray-400">
                        {message}
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-sub-background">
                <Button onClick={handleCancel} className="bg-info text-light">
                    {cancelText}
                </Button>
                <Button
                    color="red"
                    onClick={handleCofirm}
                    className="text-danger hover:text-[var(--danger-button-hover)]"
                >
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ModalConfirm;
