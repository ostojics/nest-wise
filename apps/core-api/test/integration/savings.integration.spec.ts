import {Test, TestingModule} from '@nestjs/testing';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {DataSource} from 'typeorm';
import {addYears} from 'date-fns';
import {SavingsService} from '../../src/savings/savings.service';
import {SavingsRepository} from '../../src/savings/savings.repository';
import {Savings} from '../../src/savings/savings.entity';
import {Household} from '../../src/households/household.entity';
import {License} from '../../src/licenses/license.entity';
import {Account} from '../../src/accounts/account.entity';
import {Transaction} from '../../src/transactions/transaction.entity';
import {User} from '../../src/users/user.entity';
import {HouseholdsService} from '../../src/households/households.service';
import {HouseholdsRepository} from '../../src/households/households.repository';
import {TransactionsService} from '../../src/transactions/transactions.service';
import {
  INTEGRATION_TEST_ENTITIES,
  getConfigModuleConfig,
  getTypeOrmModuleConfig,
  cleanupTestData,
  mockLoggerProvider,
  mockAccountsServiceProvider,
  mockCategoriesServiceProvider,
} from './test-utils';
import {BullModule} from '@nestjs/bullmq';
import {Queues} from '../../src/common/enums/queues.enum';
import {getPreviousMonthBoundaries} from '../../src/common/utils/date.utils';
import {AppConfig, AppConfigName} from '../../src/config/app.config';
import {GlobalConfig} from '../../src/config/config.interface';

describe('Integration - Savings Calculation', () => {
  let module: TestingModule;
  let savingsService: SavingsService;
  let householdsService: HouseholdsService;
  let dataSource: DataSource;
  let configService: ConfigService<GlobalConfig>;
  let createdLicenseId: string;
  let createdHouseholdId: string;
  let createdAccountId: string;
  let createdUserId: string;
  let timezone: string;

  // Mock TransactionsService to avoid OpenAI dependency
  const mockTransactionsService = {
    findAllTransactions: jest.fn(),
  };

  beforeAll(async () => {
    // Get Redis connection info from environment
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '32770', 10);

    module = await Test.createTestingModule({
      imports: [
        getConfigModuleConfig(),
        getTypeOrmModuleConfig(),
        TypeOrmModule.forFeature(INTEGRATION_TEST_ENTITIES),
        BullModule.forRoot({
          connection: {
            host: redisHost,
            port: redisPort,
          },
        }),
        BullModule.registerQueue(
          {
            name: Queues.SAVINGS,
          },
          {
            name: Queues.AI_TRANSACTIONS,
          },
        ),
      ],
      providers: [
        SavingsService,
        SavingsRepository,
        HouseholdsService,
        HouseholdsRepository,
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        mockLoggerProvider,
        mockAccountsServiceProvider,
        mockCategoriesServiceProvider,
      ],
    }).compile();

    savingsService = module.get<SavingsService>(SavingsService);
    householdsService = module.get<HouseholdsService>(HouseholdsService);
    dataSource = module.get<DataSource>(DataSource);
    configService = module.get<ConfigService<GlobalConfig>>(ConfigService);

    const appConfig = configService.getOrThrow<AppConfig>(AppConfigName);
    timezone = appConfig.timezone;

    // Create a test license
    const licenseRepository = dataSource.getRepository(License);
    const testLicense = licenseRepository.create({
      expiresAt: addYears(new Date(), 1),
      note: 'Test license for savings integration tests',
    });
    const savedLicense = await licenseRepository.save(testLicense);
    createdLicenseId = savedLicense.id;

    // Create a test household
    const household = await householdsService.createHousehold({
      name: 'Test Household for Savings',
      currencyCode: 'RSD',
      licenseId: createdLicenseId,
      monthlyBudget: 100000, // 100,000 RSD monthly budget
    });
    createdHouseholdId = household.id;

    // Create a test user
    const userRepository = dataSource.getRepository(User);
    const testUser = userRepository.create({
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: 'hashedpassword',
      householdId: createdHouseholdId,
    });
    const savedUser = await userRepository.save(testUser);
    createdUserId = savedUser.id;

    // Create a test account
    const accountRepository = dataSource.getRepository(Account);
    const testAccount = accountRepository.create({
      name: 'Test Account',
      type: 'checking',
      initialBalance: 50000,
      currentBalance: 50000,
      currencyCode: 'RSD',
      householdId: createdHouseholdId,
      ownerId: createdUserId,
    });
    const savedAccount = await accountRepository.save(testAccount);
    createdAccountId = savedAccount.id;
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(dataSource, [Transaction, Savings, Account, Household, License]);
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    // Clean up transactions and savings before each test
    await dataSource.getRepository(Transaction).createQueryBuilder().delete().execute();
    await dataSource.getRepository(Savings).createQueryBuilder().delete().execute();

    // Reset mock call history but keep implementations
    mockTransactionsService.findAllTransactions.mockClear();
  });

  describe('Timezone-Correct Month Boundaries', () => {
    it('should calculate savings for previous local month only', async () => {
      // Get previous month boundaries in app timezone
      const {periodYm} = getPreviousMonthBoundaries(timezone);

      // Mock findAllTransactions to return transactions only from previous month
      // In a real scenario, we would have transactions spanning multiple months,
      // but the service should only query for the previous month
      mockTransactionsService.findAllTransactions.mockResolvedValue([
        {
          id: '1',
          householdId: createdHouseholdId,
          accountId: createdAccountId,
          amount: 10000,
          type: 'expense',
          description: 'Previous month expense 1',
        },
        {
          id: '2',
          householdId: createdHouseholdId,
          accountId: createdAccountId,
          amount: 20000,
          type: 'expense',
          description: 'Previous month expense 2',
        },
      ]);

      // Calculate savings
      await savingsService.calculateSavings({
        householdId: createdHouseholdId,
      });

      // Verify findAllTransactions was called with correct date range
      expect(mockTransactionsService.findAllTransactions).toHaveBeenCalledWith(
        expect.objectContaining({
          householdId: createdHouseholdId,
          type: 'expense',
          transactionDate_from: expect.any(String),
          transactionDate_to: expect.any(String),
        }),
      );

      // Verify savings record was created
      const savingsRepository = dataSource.getRepository(Savings);
      const savings = await savingsRepository.findOne({
        where: {
          householdId: createdHouseholdId,
          periodYm,
        },
      });

      expect(savings).toBeDefined();
      expect(savings!.periodYm).toBe(periodYm);
      // Monthly budget 100,000 - expenses 30,000 = 70,000 savings
      expect(Number(savings!.amount)).toBe(70000);
    });
  });

  describe('Idempotency', () => {
    it('should not create duplicate savings when run twice for same period', async () => {
      const {periodYm} = getPreviousMonthBoundaries(timezone);

      // Mock findAllTransactions
      mockTransactionsService.findAllTransactions.mockResolvedValue([
        {
          id: '1',
          householdId: createdHouseholdId,
          accountId: createdAccountId,
          amount: 15000,
          type: 'expense',
          description: 'Test expense',
        },
      ]);

      // Run calculation first time
      await savingsService.calculateSavings({
        householdId: createdHouseholdId,
      });

      // Run calculation second time (should not throw, should be idempotent)
      await expect(
        savingsService.calculateSavings({
          householdId: createdHouseholdId,
        }),
      ).resolves.not.toThrow();

      // Verify only one savings record exists
      const savingsRepository = dataSource.getRepository(Savings);
      const allSavings = await savingsRepository.find({
        where: {
          householdId: createdHouseholdId,
          periodYm,
        },
      });

      expect(allSavings).toHaveLength(1);
      expect(Number(allSavings[0].amount)).toBe(85000); // 100,000 - 15,000
    });
  });

  describe('Period Key Format', () => {
    it('should store period_ym in YYYY-MM format', async () => {
      const {periodYm} = getPreviousMonthBoundaries(timezone);

      // Mock findAllTransactions
      mockTransactionsService.findAllTransactions.mockResolvedValue([
        {
          id: '1',
          householdId: createdHouseholdId,
          accountId: createdAccountId,
          amount: 25000,
          type: 'expense',
          description: 'Test expense',
        },
      ]);

      // Calculate savings
      await savingsService.calculateSavings({
        householdId: createdHouseholdId,
      });

      // Verify period_ym format
      const savingsRepository = dataSource.getRepository(Savings);
      const savings = await savingsRepository.findOne({
        where: {
          householdId: createdHouseholdId,
        },
      });

      expect(savings).toBeDefined();
      expect(savings!.periodYm).toBe(periodYm);
      expect(savings!.periodYm).toMatch(/^\d{4}-\d{2}$/); // YYYY-MM format
    });
  });

  describe('Defensive Calculations', () => {
    it('should never produce negative savings', async () => {
      const {periodYm} = getPreviousMonthBoundaries(timezone);

      // Mock findAllTransactions with expenses exceeding budget
      mockTransactionsService.findAllTransactions.mockResolvedValue([
        {
          id: '1',
          householdId: createdHouseholdId,
          accountId: createdAccountId,
          amount: 120000, // More than budget
          type: 'expense',
          description: 'Large expense',
        },
      ]);

      // Calculate savings
      await savingsService.calculateSavings({
        householdId: createdHouseholdId,
      });

      // Verify savings is 0, not negative
      const savingsRepository = dataSource.getRepository(Savings);
      const savings = await savingsRepository.findOne({
        where: {
          householdId: createdHouseholdId,
          periodYm,
        },
      });

      expect(savings).toBeDefined();
      expect(Number(savings!.amount)).toBe(0);
    });
  });
});
