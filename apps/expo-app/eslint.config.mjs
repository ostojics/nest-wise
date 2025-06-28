import reactConfig from '@game-stats/linting/react';
import baseConfig from '@game-stats/linting/base';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['.expo/**', 'expo-plugins/**', 'scripts/**', 'android/**', 'ios/**'],
  },
  ...baseConfig,
  ...reactConfig,
];
