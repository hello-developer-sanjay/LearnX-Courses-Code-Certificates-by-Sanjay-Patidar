// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }),
    visualizer({ open: true, filename: 'dist/stats.html' }),
    VitePWA({
      includeAssets: ['**/*.js', '**/*.css', '**/*.html', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.mp4', '**/*.mpeg', '**/*.webm'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,webp,mp4,mpeg,webm}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@actions': '/src/actions',
    },
  },
  build: {
    minify: 'esbuild',
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true,
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
});
