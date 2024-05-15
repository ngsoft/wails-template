import {skeleton} from '@skeletonlabs/tw-plugin';
import {myTheme} from "./assets/theme.js";


/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./lib/**/*.{svelte,js}",
        "./lib/*.{scss,css}",
        "./src/**/*.{svelte,js}",
        "./src/*.{scss,css}",
        "./assets/*.{scss,css}",
        "./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        skeleton({
            themes: {
                custom: [myTheme,]
            }
        })
    ],
    // added compatibility with other frameworks
    darkMode: ['class', '[data-mode="dark"]', '[data-bs-theme="dark"]'],
};


