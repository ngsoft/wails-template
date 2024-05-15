import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {fileURLToPath, URL} from 'node:url';
import fonts from './unfonts.config.js';
import Unfonts from 'unplugin-fonts/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        Unfonts(fonts),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL('./lib', import.meta.url)),
            assets: fileURLToPath(new URL('./assets', import.meta.url)),
            app: fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    build: {
        target: "esnext",
        chunkSizeWarningLimit: 1024,
    },
});
