// Global test setup file for integration tests
// This file runs after globalSetup but before each test file

// Set test environment variables if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Disable PostHog in test environment
if (!process.env.POSTHOG_ENABLED) {
  process.env.POSTHOG_ENABLED = 'false';
}

// Increase timeout for individual tests to handle container startup
jest.setTimeout(30000);
