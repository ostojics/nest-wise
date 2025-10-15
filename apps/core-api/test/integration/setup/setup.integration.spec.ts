import {Test, TestingModule} from '@nestjs/testing';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {DataSource} from 'typeorm';
import {JwtModule} from '@nestjs/jwt';
import {ForbiddenException} from '@nestjs/common';
import {addYears, add} from 'date-fns';
import {Logger} from 'pino-nestjs';
import {AuthService} from '../../../src/auth/auth.service';
import {UsersService} from '../../../src/users/users.service';
import {UsersRepository} from '../../../src/users/users.repository';
import {HouseholdsService} from '../../../src/households/households.service';
import {HouseholdsRepository} from '../../../src/households/households.repository';
import {LicensesService} from '../../../src/licenses/licenses.service';
import {LicensesRepository} from '../../../src/licenses/licenses.repository';
import {AccountsService} from '../../../src/accounts/accounts.service';
import {CategoriesService} from '../../../src/categories/categories.service';
import {EmailsService} from '../../../src/emails/emails.service';
import {User} from '../../../src/users/user.entity';
import {Household} from '../../../src/households/household.entity';
import {License} from '../../../src/licenses/license.entity';
import {Account} from '../../../src/accounts/account.entity';
import {Category} from '../../../src/categories/categories.entity';
import {Transaction} from '../../../src/transactions/transaction.entity';
import {Savings} from '../../../src/savings/savings.entity';
import {CategoryBudget} from '../../../src/category-budgets/category-budgets.entity';
import {PrivateTransaction} from '../../../src/private-transactions/private-transactions.entity';
import {appConfig, AppConfig, AppConfigName} from '../../../src/config/app.config';
import {databaseConfig, DatabaseConfig, DatabaseConfigName} from '../../../src/config/database.config';
import {queuesConfig} from '../../../src/config/queues.config';
import {throttlerConfig} from '../../../src/config/throttler.config';
import {GlobalConfig} from '../../../src/config/config.interface';
import {SetupDTO} from '@nest-wise/contracts';

describe('Integration - Setup Flow', () => {
  let module: TestingModule;
  let authService: AuthService;
  let dataSource: DataSource;
  let licensesRepository: LicensesRepository;

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
        TypeOrmModule.forFeature([
          User,
          Household,
          License,
          Account,
          Category,
          Transaction,
          Savings,
          CategoryBudget,
          PrivateTransaction,
        ]),
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => {
            const appConfig = configService.getOrThrow<AppConfig>(AppConfigName);

            return {
              secret: appConfig.jwtSecret,
              signOptions: {expiresIn: '7d'},
            };
          },
          global: true,
          imports: [ConfigModule],
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        UsersRepository,
        HouseholdsService,
        HouseholdsRepository,
        LicensesService,
        LicensesRepository,
        {
          provide: AccountsService,
          useValue: {
            findAccountsByHouseholdId: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            findCategoriesByHouseholdId: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: EmailsService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue(undefined),
            sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>(DataSource);
    licensesRepository = module.get<LicensesRepository>(LicensesRepository);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await dataSource.getRepository(User).createQueryBuilder().delete().execute();
    await dataSource.getRepository(Household).createQueryBuilder().delete().execute();
    await dataSource.getRepository(License).createQueryBuilder().delete().execute();
  });

  describe('Setup Flow', () => {
    it('should succeed with a valid (unused, unexpired) license', async () => {
      // Arrange: Create a valid license
      const license = await licensesRepository.create({
        expiresAt: addYears(new Date(), 1),
        note: 'Test license - valid',
      });

      const setupDto: SetupDTO = {
        licenseKey: license.key,
        user: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePassword123',
          confirm_password: 'SecurePassword123',
        },
        household: {
          name: 'Test Household',
          currencyCode: 'USD',
        },
      };

      // Act
      const result = await authService.setup(setupDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();

      // Verify household was created
      const households = await dataSource.getRepository(Household).find();
      expect(households).toHaveLength(1);
      expect(households[0].name).toBe('Test Household');
      expect(households[0].currencyCode).toBe('USD');
      expect(households[0].licenseId).toBe(license.id);

      // Verify user was created
      const users = await dataSource.getRepository(User).find();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('test@example.com');
      expect(users[0].username).toBe('testuser');
      expect(users[0].isHouseholdAuthor).toBe(true);
      expect(users[0].householdId).toBe(households[0].id);

      // Verify license was marked as used
      const usedLicense = await dataSource.getRepository(License).findOne({
        where: {id: license.id},
      });
      expect(usedLicense).toBeDefined();
      expect(usedLicense!.usedAt).not.toBeNull();
      expect(usedLicense!.usedAt).toBeInstanceOf(Date);
    });

    it('should fail when license is already used', async () => {
      // Arrange: Create a license and use it
      const license = await licensesRepository.create({
        expiresAt: addYears(new Date(), 1),
        note: 'Test license - already used',
      });

      const firstSetupDto: SetupDTO = {
        licenseKey: license.key,
        user: {
          username: 'firstuser',
          email: 'first@example.com',
          password: 'SecurePassword123',
          confirm_password: 'SecurePassword123',
        },
        household: {
          name: 'First Household',
          currencyCode: 'USD',
        },
      };

      // First setup succeeds
      await authService.setup(firstSetupDto);

      // Attempt second setup with same license
      const secondSetupDto: SetupDTO = {
        licenseKey: license.key,
        user: {
          username: 'seconduser',
          email: 'second@example.com',
          password: 'SecurePassword123',
          confirm_password: 'SecurePassword123',
        },
        household: {
          name: 'Second Household',
          currencyCode: 'EUR',
        },
      };

      // Act & Assert
      await expect(authService.setup(secondSetupDto)).rejects.toThrow(ForbiddenException);
      await expect(authService.setup(secondSetupDto)).rejects.toThrow('Licencni ključ je već iskorišćen');

      // Verify only one household was created
      const households = await dataSource.getRepository(Household).find();
      expect(households).toHaveLength(1);
      expect(households[0].name).toBe('First Household');

      // Verify only one user was created
      const users = await dataSource.getRepository(User).find();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('first@example.com');
    });

    it('should fail when license is expired', async () => {
      // Arrange: Create an expired license
      const license = await licensesRepository.create({
        expiresAt: add(new Date(), {days: -1}), // Expired yesterday
        note: 'Test license - expired',
      });

      const setupDto: SetupDTO = {
        licenseKey: license.key,
        user: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePassword123',
          confirm_password: 'SecurePassword123',
        },
        household: {
          name: 'Test Household',
          currencyCode: 'USD',
        },
      };

      // Act & Assert
      await expect(authService.setup(setupDto)).rejects.toThrow(ForbiddenException);
      await expect(authService.setup(setupDto)).rejects.toThrow('Licencni ključ je istekao');

      // Verify no household was created
      const households = await dataSource.getRepository(Household).find();
      expect(households).toHaveLength(0);

      // Verify no user was created
      const users = await dataSource.getRepository(User).find();
      expect(users).toHaveLength(0);

      // Verify license was not marked as used
      const unusedLicense = await dataSource.getRepository(License).findOne({
        where: {id: license.id},
      });
      expect(unusedLicense).toBeDefined();
      expect(unusedLicense!.usedAt).toBeNull();
    });

    it('should not allow license reuse across multiple households (idempotence check)', async () => {
      // Arrange: Create a valid license
      const license = await licensesRepository.create({
        expiresAt: addYears(new Date(), 1),
        note: 'Test license - reuse check',
      });

      const firstSetupDto: SetupDTO = {
        licenseKey: license.key,
        user: {
          username: 'firstuser',
          email: 'first@example.com',
          password: 'SecurePassword123',
          confirm_password: 'SecurePassword123',
        },
        household: {
          name: 'First Household',
          currencyCode: 'USD',
        },
      };

      // First setup succeeds
      const firstResult = await authService.setup(firstSetupDto);
      expect(firstResult.accessToken).toBeDefined();

      // Get the original usedAt timestamp
      const licenseAfterFirstUse = await dataSource.getRepository(License).findOne({
        where: {id: license.id},
      });
      const originalUsedAt = licenseAfterFirstUse!.usedAt;
      expect(originalUsedAt).not.toBeNull();

      // Attempt second setup with different household data but same license
      const secondSetupDto: SetupDTO = {
        licenseKey: license.key,
        user: {
          username: 'differentuser',
          email: 'different@example.com',
          password: 'DifferentPassword456',
          confirm_password: 'DifferentPassword456',
        },
        household: {
          name: 'Different Household',
          currencyCode: 'EUR',
        },
      };

      // Act & Assert
      await expect(authService.setup(secondSetupDto)).rejects.toThrow(ForbiddenException);
      await expect(authService.setup(secondSetupDto)).rejects.toThrow('Licencni ključ je već iskorišćen');

      // Verify only one household exists
      const households = await dataSource.getRepository(Household).find();
      expect(households).toHaveLength(1);
      expect(households[0].name).toBe('First Household');
      expect(households[0].licenseId).toBe(license.id);

      // Verify usedAt timestamp hasn't changed
      const licenseAfterSecondAttempt = await dataSource.getRepository(License).findOne({
        where: {id: license.id},
      });
      expect(licenseAfterSecondAttempt!.usedAt).toEqual(originalUsedAt);
    });
  });
});
