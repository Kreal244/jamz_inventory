import { FileInput, Label } from "flowbite-react";
import { FaCloudArrowUp, FaRegPenToSquare } from "react-icons/fa6";
import _ from "lodash";
import { useState } from "react";
function InputImage({
    imageUrl,
    productName,
    className = "",
    handleImport = () => {},
}: {
    className?: string;
    productName?: string;
    handleImport?: CallableFunction;
    imageUrl?: string;
}) {
    const [error, setError] = useState(false);
    const [keyRefresh, setKeyRefresh] = useState(Math.random() * 10 + 1);
    return (
        <>
            {_.isEmpty(imageUrl) ? (
                <div
                    className={
                        "flex w-full items-center justify-center mx-auto mb-3 " +
                        className
                    }
                >
                    <Label
                        htmlFor="dropzone-file"
                        className="p-2 dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <FaCloudArrowUp className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 max-md:text-xsm truncate">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className="text-xsm text-gray-500 dark:text-gray-400">
                                Image
                            </p>
                        </div>
                        <FileInput
                            id="dropzone-file"
                            className="hidden"
                            onChange={(event) => {
                                handleImport(event.target.files?.[0], (value) =>
                                    setKeyRefresh(value)
                                );
                            }}
                            accept="image/*"
                        />
                    </Label>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <img
                        src={imageUrl + "?" + keyRefresh}
                        className="max-w-[70%] mb-2"
                        alt={productName}
                    />
                    <FileInput
                        onChange={(event) => {
                            handleImport(event.target.files?.[0]);
                        }}
                        accept="image/*"
                    />
                </div>
            )}
            {error && (
                <div className="text-danger text-sm pl-5">
                    File must have extention <b>.csv</b>
                </div>
            )}
        </>
    );
}
export default InputImage;
