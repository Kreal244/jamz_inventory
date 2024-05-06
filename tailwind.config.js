import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
        "node_modules/flowbite-react/lib/esm/**/*.js",
    ],

    theme: {
        backgroundColor: {
            main: "var(--main-color)",
            sub: "var(--sub-color)",
            loading: "var(--loading-color)",
            background: "var(--background-color)",
            "sub-background": "var(--background-sub-color)",
            cover: "var(--cover-color)",
            primary: "var(--primary-button)",
            success: "var(--success-button)",
            default: "var(--default-button)",
            danger: "var(--danger-button)",
            notification: "var(--notification-button)",
            link: "var(--link-button)",
            info: "var(--info-button)",
            //hover
            "primary-hover": "var(--primary-button-hover: #d6d6d6)",
            "success-hover": "var(--success-button-hover: #237b59)",
            "default-hover": "var(--default-button-hover: #9b8b7d)",
            "danger-hover": "var(--danger-button-hover: #b86d68)",
            "notifcation-hover": "var(--notifcation-button-hover: #c2b69f)",
            "info-hover": "var(--info-button-hover: #1f7d74)",
            "link-hover": "var(--link-button-hover: #2a7dc2)",
        },
        textColor: {
            default: "var(--text-color)",
            hover: "var(--text-hover-color)",
            active: "var(--text-active-color)",
            light: "var(--text-button-light)",
            dark: "var(--text-button-dark)",
            link: "var(--link-button)",
            danger: "var(--text-danger)",
            failure: "var(--text-danger)",
            success: "var(--text-success)",
            info: "var(--info-button)",
        },
        extend: {
            screens: {
                xsm: "320px",
                //     md: "768px",
                //     lg: "976px",
                //     xl: "1440px",
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                xsm: "12px",
            },
        },
    },

    plugins: [forms, require("flowbite/plugin")],
};
