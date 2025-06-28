import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import {analyzer} from 'vite-bundle-analyzer';

// https://vite.dev/config/
export default defineConfig((env) => ({
  plugins: [react(), env.mode !== 'test' && eslintPlugin(), analyzer()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}));
