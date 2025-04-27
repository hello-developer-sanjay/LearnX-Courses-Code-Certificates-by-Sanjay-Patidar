import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }), // Changed to Brotli for better compression
    visualizer({ open: true, filename: 'dist/stats.html' }),
    VitePWA({
      includeAssets: ['**/*.js', '**/*.css', '**/*.html'], // Removed media assets (handled by CloudFront)
      workbox: {
        globPatterns: ['**/*.{js,css,html}'], // Match only JS/CSS/HTML for service worker
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|gif|webp|mp4|mpeg|webm)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'media-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux'],
          codemirror: [
            '@uiw/react-codemirror',
            '@codemirror/lang-javascript',
            '@codemirror/lang-python',
            '@codemirror/lang-css',
            '@codemirror/lang-html',
            '@codemirror/lang-markdown',
            '@codemirror/commands',
            '@codemirror/view',
            '@codemirror/autocomplete',
            '@codemirror/theme-one-dark',
            '@uiw/codemirror-theme-dracula',
          ],
          animations: ['framer-motion'],
          syntax: ['react-syntax-highlighter'], // Added for PostPage.jsx
          zoom: ['react-medium-image-zoom'], // Added for PostPage.jsx
          toast: ['react-toastify'], // Added for PostPage.jsx
        },
      },
    },
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
