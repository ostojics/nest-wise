import type {Config} from 'jest';

const config: Config = {
  displayName: 'Core API Integration Tests',
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/test/integration/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: './test/integration/tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/**/*.spec.ts', '!src/**/*.e2e-spec.ts'],
  coverageDirectory: './coverage-integration',
  globalSetup: './test/integration/setup/global-setup-simple.ts',
  globalTeardown: './test/integration/setup/global-teardown.ts',
  testTimeout: 60000, // 60 seconds for container startup
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/integration/setup/test-setup.ts'],
  preset: 'ts-jest',
};

export default config;
