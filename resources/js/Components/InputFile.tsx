import { FileInput, Label } from "flowbite-react";
import { FaCloudArrowUp } from "react-icons/fa6";
import _ from "lodash";
import { PropsWithChildren, useState } from "react";
function InputFile({
    handleImport,
}: PropsWithChildren<{ handleImport: CallableFunction }>) {
    const [error, setError] = useState(false);
    return (
        <>
            <div className="flex w-[80%]  items-center justify-center mx-auto ">
                <Label
                    htmlFor="dropzone-file"
                    className="dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <FaCloudArrowUp className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 max-sm:text-xsm">
                            <span className="font-semibold">
                                Click to upload
                            </span>{" "}
                            or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            CSV file
                        </p>
                    </div>
                    <FileInput
                        id="dropzone-file"
                        className="hidden"
                        onChange={(event) => {
                            if (
                                _.head(event.target.files)?.type !== "text/csv"
                            ) {
                                setError(true);
                            } else {
                                setError(false);
                                handleImport(event);
                            }
                        }}
                        accept=".csv"
                    />
                </Label>
            </div>
            {error && (
                <div className="text-danger text-sm pl-5">
                    File must have extention <b>.csv</b>
                </div>
            )}
        </>
    );
}
export default InputFile;
