import reactConfig from '@nest-wise/linting/react';
import baseConfig from '@nest-wise/linting/base';
import unicorn from 'eslint-plugin-unicorn';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['dist/**/*', 'src/routeTree.gen.ts'],
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
    plugins: {
      unicorn,
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
];
