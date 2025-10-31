import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql';
import {RedisContainer, StartedRedisContainer} from '@testcontainers/redis';

declare global {
  // eslint-disable-next-line no-var
  var __POSTGRES_CONTAINER__: StartedPostgreSqlContainer;
  // eslint-disable-next-line no-var
  var __REDIS_CONTAINER__: StartedRedisContainer;
}

export default async function globalSetup(): Promise<void> {
  console.log('Starting integration test containers...');

  try {
    // Start PostgreSQL container
    console.log('Starting PostgreSQL container...');
    const postgresContainer = await new PostgreSqlContainer('postgres:15')
      .withDatabase('nestwise_test')
      .withUsername('test_user')
      .withPassword('test_password')
      .withExposedPorts(5432)
      .start();

    global.__POSTGRES_CONTAINER__ = postgresContainer;

    // Start Redis container
    console.log('Starting Redis container...');
    const redisContainer = await new RedisContainer('redis:7-alpine').withExposedPorts(6379).start();

    global.__REDIS_CONTAINER__ = redisContainer;

    // Set environment variables for the application
    process.env.NODE_ENV = 'test';
    process.env.DB_HOST = postgresContainer.getHost();
    process.env.DB_PORT = postgresContainer.getMappedPort(5432).toString();
    process.env.DB_USERNAME = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.DB_DATABASE = 'nestwise_test';
    process.env.DB_USE_SSL = 'false';

    process.env.REDIS_HOST = redisContainer.getHost();
    process.env.REDIS_PORT = redisContainer.getMappedPort(6379).toString();
    process.env.REDIS_PASSWORD = '';

    // Other required environment variables
    process.env.RESEND_API_KEY = 'dummy-key-for-test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.APP_URL = 'http://localhost:8080';
    process.env.WEB_APP_URL = 'http://localhost:5173';
    process.env.OPENAI_API_KEY = 'dummy-key-for-test';

    console.log('✅ Integration test containers started successfully');
    console.log(`PostgreSQL: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    console.log('Note: Database migrations will be handled during NestJS app initialization');
  } catch (error) {
    console.error('❌ Failed to start integration test containers:', error);
    throw error;
  }
}
