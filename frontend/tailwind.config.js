import twElements from 'tw-elements/dist/plugin.cjs';


/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./lib/**/*.{svelte,js}",
        "./lib/*.{scss,css}",
        "./src/**/*.{svelte,js}",
        "./src/*.{scss,css}",
        "./assets/*.{scss,css}",
        "./node_modules/tw-elements/dist/js/**/*.js",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        twElements
    ],
    // added compatibility with other frameworks
    darkMode: ['class', '[data-mode="dark"]', '[data-bs-theme="dark"]'],
};