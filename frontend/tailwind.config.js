import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import {skeleton} from '@skeletonlabs/tw-plugin';
import {myTheme} from "./assets/theme.js";


/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./lib/**/*.{svelte,js,scss,css}",
        "./src/**/*.{svelte,js,scss,css}",
        "./assets/*.{scss,css}",
        "./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        forms,
        typography,
        skeleton({
            themes: {
                preset: [
                    {
                        name: 'hamlindigo',
                        enhancements: true,
                    },
                ],
            },
        })
    ],
    // added compatibility with other frameworks
    darkMode: ['class', '[data-mode="dark"]', '[data-bs-theme="dark"]'],
};


