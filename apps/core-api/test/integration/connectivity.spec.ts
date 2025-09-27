import {Test, TestingModule} from '@nestjs/testing';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {createClient, RedisClientType} from 'redis';
import {appConfig} from '../../src/config/app.config';
import {databaseConfig, DatabaseConfig, DatabaseConfigName} from '../../src/config/database.config';
import {queuesConfig, QueuesConfig, QueuesConfigName} from '../../src/config/queues.config';
import {throttlerConfig} from '../../src/config/throttler.config';
import {GlobalConfig} from '../../src/config/config.interface';

describe('Integration - Connectivity', () => {
  let module: TestingModule;
  let dataSource: DataSource;
  let redisClient: RedisClientType;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          cache: true,
          load: [appConfig, throttlerConfig, databaseConfig, queuesConfig],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService<GlobalConfig>) => {
            const config = configService.getOrThrow<DatabaseConfig>(DatabaseConfigName);
            return {
              ...config,
            };
          },
        }),
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);

    // Create Redis client
    const configService = module.get<ConfigService<GlobalConfig>>(ConfigService);
    const queuesConf = configService.getOrThrow<QueuesConfig>(QueuesConfigName);

    redisClient = createClient({
      socket: {
        host: queuesConf.redisHost,
        port: queuesConf.redisPort,
      },
      password: queuesConf.redisPassword || undefined,
    });
  });

  afterAll(async () => {
    if (redisClient?.isOpen) {
      await redisClient.disconnect();
    }
    if (module) {
      await module.close();
    }
  });

  describe('Database Connection', () => {
    it('should connect to PostgreSQL successfully', async () => {
      expect(dataSource).toBeDefined();
      expect(dataSource.isInitialized).toBe(true);
    });

    it('should execute a simple query', async () => {
      const result = await dataSource.query('SELECT 1 as test_value');
      expect(result).toEqual([{test_value: 1}]);
    });

    it('should have migrations applied', async () => {
      const result = await dataSource.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      );

      const tableNames = result.map((row: any) => row.table_name);

      // Check for key tables that should exist after migrations
      expect(tableNames).toContain('households');
      expect(tableNames).toContain('users');
      expect(tableNames).toContain('accounts');
      expect(tableNames).toContain('categories');
      expect(tableNames).toContain('transactions');
      expect(tableNames).toContain('licenses');
    });
  });

  describe('Redis Connection', () => {
    it('should connect to Redis successfully', async () => {
      await redisClient.connect();
      expect(redisClient.isOpen).toBe(true);
    });

    it('should ping Redis successfully', async () => {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const pong = await redisClient.ping();
      expect(pong).toBe('PONG');
    });

    it('should set and get a value from Redis', async () => {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const testKey = 'integration-test-key';
      const testValue = 'integration-test-value';

      await redisClient.set(testKey, testValue);
      const retrievedValue = await redisClient.get(testKey);

      expect(retrievedValue).toBe(testValue);

      // Clean up
      await redisClient.del(testKey);
    });
  });
});
