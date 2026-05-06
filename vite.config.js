import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ command }) => ({
	plugins: [
		react(),
		tailwindcss(),
		visualizer({
			filename: "dist/stats.html",
			gzipSize: true,
			brotliSize: true,
		}),
	],
	base: command === "serve" ? "/" : "/Pragmata-unit-printer/",
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return;
					if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react";
					if (/node_modules\/(framer-motion|motion-)/.test(id)) return "framer";
					return "vendor";
				},
			},
		},
	},
}));
