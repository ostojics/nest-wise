import reactConfig from '@maya-vault/linting/react';
import baseConfig from '@maya-vault/linting/base';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['dist/**/*'],
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
