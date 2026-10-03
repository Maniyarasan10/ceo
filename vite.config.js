import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The repo's GitHub Pages site uses the custom domain ceo.problemsolvingmind.com,
  // which serves at the domain root while the /ceo/ project URL redirects there.
  // A relative base makes asset URLs resolve against wherever the HTML is served
  // from, so the same build works at the domain root and under /ceo/ alike.
  base: './',
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
