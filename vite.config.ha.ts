import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rollupOptions: {
			input: resolve(__dirname, 'src/ha-main.tsx'),
			output: {
				entryFileNames: 'ha.js',
				format: 'es',
			},
		},
		minify: 'terser',
		terserOptions: {
			compress: {
				defaults: true,
				arguments: true,
				toplevel: true,
			},
			mangle: true,
			format: {
				beautify: false,
				comments: false,
				ecma: 2020,
				inline_script: false,
			},
		},
	},
});
