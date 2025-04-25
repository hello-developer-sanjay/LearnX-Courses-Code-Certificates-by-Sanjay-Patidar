import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }), // Compress assets for faster delivery
    visualizer({ open: true, filename: 'dist/stats.html' }), // Bundle analysis
  ],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@actions': '/src/actions',
    },
  },
  build: {
    minify: 'terser', // Use Terser for aggressive minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'], // Remove specific console methods
      },
    },
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy dependencies into separate chunks
          vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux'],
          codemirror: ['@uiw/react-codemirror', '@codemirror/*'],
          animations: ['framer-motion', 'react-spring'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle critical dependencies
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});