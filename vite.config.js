import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the repo from /<repo>/, so the build has to emit asset URLs
  // under that prefix or every JS/CSS/image request 404s. Only applied in CI -
  // local dev and `vite preview` keep serving from the root.
  base: process.env.GITHUB_ACTIONS ? '/ceo/' : '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
