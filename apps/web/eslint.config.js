import reactConfig from '@nest-wise/linting/react';
import baseConfig from '@nest-wise/linting/base';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['dist/**/*', 'dev-dist/**/*'],
  },
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      'no-console': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
  },
];
