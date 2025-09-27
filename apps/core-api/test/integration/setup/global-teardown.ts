export default async function globalTeardown(): Promise<void> {
  console.log('Stopping integration test containers...');

  try {
    if (global.__POSTGRES_CONTAINER__) {
      await global.__POSTGRES_CONTAINER__.stop();
      console.log('✅ PostgreSQL container stopped');
    }

    if (global.__REDIS_CONTAINER__) {
      await global.__REDIS_CONTAINER__.stop();
      console.log('✅ Redis container stopped');
    }

    console.log('✅ All integration test containers stopped successfully');
  } catch (error) {
    console.error('❌ Failed to stop integration test containers:', error);
    // Don't throw here to avoid failing the test suite cleanup
  }
}
