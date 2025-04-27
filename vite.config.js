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
      includeAssets: ['**/*.wasm', '**/*.js'], // Ensure WASM and JS files are included
      workbox: {
        globPatterns: ['**/*.{js,css,html,wasm}'], // Cache WASM files
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug'],
        keep_fargs: true, // Preserve function arguments to avoid mangling 'e'
        keep_fnames: true, // Preserve function names
      },
      mangle: {
        reserved: ['pica', 'L1', 'e', 'resize', 'init'], // Reserve critical pica variables
        keep_fnames: true, // Prevent mangling of function names
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
          pica: ['pica'],
        },
      },
    },
    assetsInclude: ['**/*.wasm'], // Explicitly include WASM files
    outDir: 'dist',
    assetsDir: 'assets',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'pica'],
    force: true, // Force pre-bundling of pica
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
  // Ensure WASM files are served with correct MIME type
  assetsInclude: ['**/*.wasm'],
});
