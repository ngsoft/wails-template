import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import {skeleton} from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./lib/**/*.{svelte,js,scss,css}",
        "./src/**/*.{svelte,js,scss,css}",
        "./assets/*.{scss,css}",
        "./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}"
    ],
    // preload all colors (less optimised css size)
    // safelist: [{pattern: /(bg|text|shadow|btn|alert|outline)-(slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuschia|pink|rose|primary|secondary|success|danger|warning|info)/}],
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


