import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, filename: 'dist/stats.html' }),
    VitePWA({
      registerType: 'autoUpdate', // Auto-update service worker
      srcDir: 'src', // Source directory for service worker
      filename: 'sw.js', // Explicitly name service worker file
      includeAssets: ['**/*.js', '**/*.css', '**/*.html'],
      workbox: {
        globPatterns: ['**/*.{js,css,html}'],
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
      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
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
    sourcemap: false, // Disable sourcemaps to avoid serving issues
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
          syntax: ['react-syntax-highlighter'],
          zoom: ['react-medium-image-zoom'],
          toast: ['react-toastify'],
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
