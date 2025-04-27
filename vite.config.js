import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }), // Compress assets
    visualizer({ open: true, filename: 'dist/stats.html' }), // Bundle analysis
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*.{js,css,html,png,jpg,webp,wasm}'], // Ensure WASM assets are included
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
        // Avoid removing console.error to aid debugging
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
      mangle: {
        reserved: ['pica', 'L1'], // Prevent mangling of pica-related names
      },
    },
    sourcemap: true, // Enable sourcemaps for debugging
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
          pica: ['pica'], // Explicitly separate pica to ensure proper loading
        },
      },
    },
    assetsInclude: ['**/*.wasm'], // Ensure WASM files are included
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'pica'], // Pre-bundle pica
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  server: {
    fs: {
      // Allow serving WASM files
      allow: ['.'],
    },
  },
});
