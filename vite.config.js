import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa'; // Optional for WASM handling

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }),
    visualizer({ open: true, filename: 'dist/stats.html' }),
    VitePWA({
      // Optional: Ensure WASM files are treated as assets
      includeAssets: ['**/*.wasm'],
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
        pure_funcs: ['console.info', 'console.debug'], // Keep console.warn for debugging
      },
      mangle: {
        reserved: ['pica', 'L1'], // Prevent mangling of pica-related variables
      },
    },
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
          pica: ['pica'], // Explicitly include pica in a separate chunk
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
