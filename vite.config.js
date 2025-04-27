// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
  plugins: [
    react({
      // Enable Styled Components support
      babel: {
        plugins: ['styled-components'],
      },
    }),
    viteCompression({ algorithm: 'gzip', threshold: 1024 }), // Compress files > 1KB
    visualizer({ open: true, filename: 'dist/stats.html' }),
    VitePWA({
      includeAssets: ['**/*.js', '**/*.css', '**/*.html', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.mp4', '**/*.mpeg', '**/*.webm'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,webp,mp4,mpeg,webm}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
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
  css: {
    postcss: {
      plugins: [
        postcssNesting(), // Support CSS nesting
        // Add Tailwind CSS if used
        require('tailwindcss')(),
        require('autoprefixer')(),
      ],
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
          styles: ['styled-components'], // Separate chunk for Styled Components
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@uiw/react-codemirror',
      '@codemirror/lang-javascript',
      'styled-components',
      'framer-motion',
    ],
    force: true,
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    charset: 'utf8',
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
});
