import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const srcDir = new URL("./src", import.meta.url).pathname;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": srcDir
        }
    },
    server: {
        port: 3000
    },
    build: {
        outDir: "dist",
        sourcemap: true
    }
});
