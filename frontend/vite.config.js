import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {fileURLToPath, URL} from 'node:url';
import fonts from './unfonts.config.js';
import Unfonts from 'unplugin-fonts/vite';
import {readFileSync, writeFileSync} from "node:fs";
import path from 'node:path';


async function postBuildCommands() {


    let
        file = 'dist/index.html',
        contents = readFileSync(file, 'utf8'),
        lines = contents.split('\n'),
        newLines = [], line, script;


    for (let i = 0; i < lines.length; i++) {
        line = lines[i].trim();

        if (/<script type="module"/.test(line)) {
            script = line;
            continue;

        }

        if (/<\/body>/.test(line) && script) {
            newLines.push(script);
        }

        newLines.push(line);
    }

    try {
        writeFileSync(file, newLines.join('\n'));
    } catch (err) {
        console.error(err);
    }


}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        Unfonts(fonts),
        {
            name: 'postbuild-commands',
            closeBundle: async () => {
                await postBuildCommands() // run during closeBundle hook. https://rollupjs.org/guide/en/#closebundle
            }
        },
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
