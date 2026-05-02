import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { copyFileSync } from 'node:fs';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-pages-index",
      closeBundle() {
        if (command === "build") copyFileSync("index.html", "dist/index.html");
      },
    },
  ],
  base: command === "serve" ? "/" : "/Pragmata-unit-printer/",
  build: {
    rollupOptions: {
      input: "src/main.jsx",
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/main.js",
      },
    },
  },
}));
