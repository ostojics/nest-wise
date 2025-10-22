import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import {visualizer} from 'rollup-plugin-visualizer';
import {tanstackRouter} from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import {VitePWA} from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig((env) => ({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    env.mode !== 'test' && eslintPlugin(),
    env.mode !== 'test' &&
      process.env.ANALYZE === 'true' &&
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false, // Avoid double registration since we use virtual module explicitly
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
      ],
      devOptions: {
        enabled: true,
      },
      workbox: {
        cleanupOutdatedCaches: true,
      },
      manifest: false,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'es2022',
    // Let Vite's automatic code-splitting handle chunking intelligently
    // The lazy loading we've added will create separate chunks automatically
  },
}));
