import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One self-contained HTML file (used for instant preview / static hosting).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { target: 'es2020', outDir: 'dist-single' },
});
