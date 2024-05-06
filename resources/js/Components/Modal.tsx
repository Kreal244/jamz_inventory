import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import _ from "lodash";
export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
    closeable?: boolean;
    onClose?: CallableFunction;
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };
    const [angle, setAngle] = useState(
        window.innerWidth > window.innerHeight && window.innerWidth < 1024
    );
    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];
    window.addEventListener("orientationchange", () => {
        setAngle(!!screen.orientation.angle);
    });
    window.addEventListener("resize", () => {
        setAngle(
            window.innerWidth > window.innerHeight && window.innerWidth < 1024
        );
    });
    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className={`fixed overflow-y-auto inset-0 flex justify-center px-4 md:py-6  items-center z-50 transform transition-all bg-cover ${
                    angle ? "" : "pt-4"
                }`}
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto ${maxWidthClass} max-md:min-w-[78%] max-sm:min-w-[290px] max-md:min-h-max`}
                        style={angle ? { marginTop: "auto" } : {}}
                    >
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
