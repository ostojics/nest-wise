import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslintPlugin from '@nabla/vite-plugin-eslint';
// import {analyzer} from 'vite-bundle-analyzer';
import {tanstackRouter} from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import {VitePWA} from 'vite-plugin-pwa';
import {readFileSync} from 'fs';
import {join} from 'path';

// Helper to get app version for build-time injection
const getAppVersion = (): string => {
  // First try environment variable (from CI)
  if (process.env.VITE_APP_VERSION) {
    return process.env.VITE_APP_VERSION;
  }

  // Try to read from root VERSION file
  try {
    const versionPath = join(process.cwd(), '../../VERSION');
    const version = readFileSync(versionPath, 'utf8').trim();
    if (version) {
      // In development, append git sha if available
      if (process.env.NODE_ENV === 'development') {
        try {
          const {execSync} = require('child_process');
          const gitSha = execSync('git rev-parse --short HEAD', {encoding: 'utf8'}).trim();
          return `${version}-dev+${gitSha}`;
        } catch {
          return `${version}-dev`;
        }
      }
      return version;
    }
  } catch {
    // Fall back to package.json if VERSION file doesn't exist
  }

  // Fallback to local dev version
  return '0.0.0-dev';
};

// Helper to get git commit
const getGitCommit = (): string => {
  if (process.env.VITE_GIT_COMMIT) {
    return process.env.VITE_GIT_COMMIT;
  }

  // In development, try to get git SHA
  try {
    const {execSync} = require('child_process');
    return execSync('git rev-parse --short HEAD', {encoding: 'utf8'}).trim();
  } catch {
    return 'unknown';
  }
};

// Helper to get build date
const getBuildDate = (): string => {
  return process.env.VITE_BUILD_DATE || new Date().toISOString();
};

// https://vite.dev/config/
export default defineConfig((env) => ({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    env.mode !== 'test' && eslintPlugin(),
    // analyzer(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
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
  define: {
    // Inject version information at build time
    __APP_VERSION__: JSON.stringify(getAppVersion()),
    __GIT_COMMIT__: JSON.stringify(getGitCommit()),
    __BUILD_DATE__: JSON.stringify(getBuildDate()),
  },
}));
