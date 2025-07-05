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
    files: ['src/**/*.{ts,tsx}'],
  },
];
