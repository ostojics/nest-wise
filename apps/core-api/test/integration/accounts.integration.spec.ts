import {Test, TestingModule} from '@nestjs/testing';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {addYears} from 'date-fns';
import {ConflictException} from '@nestjs/common';
import {AccountsService} from '../../src/accounts/accounts.service';
import {AccountsRepository} from '../../src/accounts/accounts.repository';
import {TransactionsService} from '../../src/transactions/transactions.service';
import {TransactionsRepository} from '../../src/transactions/transactions.repository';
import {HouseholdsService} from '../../src/households/households.service';
import {HouseholdsRepository} from '../../src/households/households.repository';
import {Account} from '../../src/accounts/account.entity';
import {Transaction} from '../../src/transactions/transaction.entity';
import {Household} from '../../src/households/household.entity';
import {User} from '../../src/users/user.entity';
import {License} from '../../src/licenses/license.entity';
import {Category} from '../../src/categories/categories.entity';
import {CreateAccountHouseholdScopedDTO, CreateTransactionHouseholdDTO} from '@nest-wise/contracts';
import {
  INTEGRATION_TEST_ENTITIES,
  getConfigModuleConfig,
  getTypeOrmModuleConfig,
  mockCategoriesServiceProvider,
  mockEmailsServiceProvider,
  mockLoggerProvider,
  cleanupTestData,
} from './test-utils';
import {Queue} from 'bullmq';

// Mock the BullMQ Queue
const mockQueue = {
  add: jest.fn(),
  getJob: jest.fn(),
} as unknown as Queue;

describe('Integration - Accounts', () => {
  let module: TestingModule;
  let accountsService: AccountsService;
  let transactionsService: TransactionsService;
  let householdsService: HouseholdsService;
  let dataSource: DataSource;
  let createdLicenseId: string;
  let createdHouseholdId: string;
  let createdUserId: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModuleConfig(), getTypeOrmModuleConfig(), TypeOrmModule.forFeature(INTEGRATION_TEST_ENTITIES)],
      providers: [
        AccountsService,
        AccountsRepository,
        TransactionsService,
        TransactionsRepository,
        HouseholdsService,
        HouseholdsRepository,
        mockCategoriesServiceProvider,
        mockEmailsServiceProvider,
        mockLoggerProvider,
        {
          provide: 'BullQueue_ai-transactions',
          useValue: mockQueue,
        },
      ],
    }).compile();

    accountsService = module.get<AccountsService>(AccountsService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    householdsService = module.get<HouseholdsService>(HouseholdsService);
    dataSource = module.get<DataSource>(DataSource);

    // Create a test license
    const licenseRepository = dataSource.getRepository(License);
    const testLicense = licenseRepository.create({
      expiresAt: addYears(new Date(), 1),
      note: 'Test license for accounts integration tests',
    });
    const savedLicense = await licenseRepository.save(testLicense);
    createdLicenseId = savedLicense.id;

    // Create a test household
    const household = await householdsService.createHousehold({
      name: 'Test Household',
      currencyCode: 'USD',
      licenseId: createdLicenseId,
    });
    createdHouseholdId = household.id;

    // Create a test user in the household
    const userRepository = dataSource.getRepository(User);
    const testUser = userRepository.create({
      householdId: createdHouseholdId,
      username: 'testuser',
      email: 'testuser@example.com',
      passwordHash: 'hashedpassword',
      isHouseholdAuthor: true,
    });
    const savedUser = await userRepository.save(testUser);
    createdUserId = savedUser.id;
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    // Clean up accounts and transactions before each test
    await cleanupTestData(dataSource, [Transaction, Account]);
  });

  describe('Account Creation and Persistence', () => {
    it('should create an account with initial balance', async () => {
      const createAccountDto: CreateAccountHouseholdScopedDTO = {
        name: 'Checking Account',
        type: 'checking',
        initialBalance: 1000,
        ownerId: createdUserId,
      };

      const account = await accountsService.createAccountForHousehold(createdHouseholdId, createAccountDto);

      // Verify returned account
      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.householdId).toBe(createdHouseholdId);
      expect(account.ownerId).toBe(createdUserId);
      expect(account.name).toBe(createAccountDto.name);
      expect(account.type).toBe(createAccountDto.type);
      expect(Number(account.initialBalance)).toBe(createAccountDto.initialBalance);
      expect(Number(account.currentBalance)).toBe(createAccountDto.initialBalance);
      expect(account.createdAt).toBeDefined();
      expect(account.updatedAt).toBeDefined();

      // Verify persistence in database
      const accountRepository = dataSource.getRepository(Account);
      const persistedAccount = await accountRepository.findOne({
        where: {id: account.id},
      });

      expect(persistedAccount).toBeDefined();
      expect(persistedAccount!.name).toBe(createAccountDto.name);
      expect(Number(persistedAccount!.currentBalance)).toBe(createAccountDto.initialBalance);
      expect(Number(persistedAccount!.initialBalance)).toBe(createAccountDto.initialBalance);
    });
  });

  describe('List Accounts by Household', () => {
    it('should list all accounts for a household', async () => {
      // Create two accounts
      const account1Dto: CreateAccountHouseholdScopedDTO = {
        name: 'Checking Account',
        type: 'checking',
        initialBalance: 1000,
        ownerId: createdUserId,
      };

      const account2Dto: CreateAccountHouseholdScopedDTO = {
        name: 'Savings Account',
        type: 'savings',
        initialBalance: 5000,
        ownerId: createdUserId,
      };

      const account1 = await accountsService.createAccountForHousehold(createdHouseholdId, account1Dto);
      const account2 = await accountsService.createAccountForHousehold(createdHouseholdId, account2Dto);

      // List accounts
      const accounts = await accountsService.findAccountsByHouseholdId(createdHouseholdId);

      expect(accounts).toBeDefined();
      expect(accounts.length).toBe(2);

      const accountIds = accounts.map((a) => a.id);
      expect(accountIds).toContain(account1.id);
      expect(accountIds).toContain(account2.id);

      const accountNames = accounts.map((a) => a.name);
      expect(accountNames).toContain('Checking Account');
      expect(accountNames).toContain('Savings Account');

      // Verify balances
      const checkingAccount = accounts.find((a) => a.name === 'Checking Account');
      const savingsAccount = accounts.find((a) => a.name === 'Savings Account');
      expect(Number(checkingAccount!.currentBalance)).toBe(1000);
      expect(Number(savingsAccount!.currentBalance)).toBe(5000);
    });
  });

  describe('Balance Updates via Transactions', () => {
    it('should update account balance on expense transaction', async () => {
      // Create account with initial balance
      const createAccountDto: CreateAccountHouseholdScopedDTO = {
        name: 'Test Account',
        type: 'checking',
        initialBalance: 1000,
        ownerId: createdUserId,
      };

      const account = await accountsService.createAccountForHousehold(createdHouseholdId, createAccountDto);
      const initialBalance = Number(account.currentBalance);

      // Create a category for the expense
      const categoryRepository = dataSource.getRepository(Category);
      const category = categoryRepository.create({
        householdId: createdHouseholdId,
        name: 'Groceries',
        description: 'Food and groceries',
      });
      const savedCategory = await categoryRepository.save(category);

      // Create expense transaction
      const expenseDto: CreateTransactionHouseholdDTO = {
        accountId: account.id,
        type: 'expense',
        amount: 150,
        categoryId: savedCategory.id,
        description: 'Grocery shopping',
        transactionDate: new Date().toISOString(),
      };

      await transactionsService.createTransactionForHousehold(createdHouseholdId, expenseDto);

      // Reload account and verify balance decreased
      const updatedAccount = await accountsService.findAccountById(account.id);
      const expectedBalance = initialBalance - expenseDto.amount;
      expect(Number(updatedAccount.currentBalance)).toBe(expectedBalance);
    });

    it('should update account balance on income transaction', async () => {
      // Create account with initial balance
      const createAccountDto: CreateAccountHouseholdScopedDTO = {
        name: 'Test Account',
        type: 'checking',
        initialBalance: 1000,
        ownerId: createdUserId,
      };

      const account = await accountsService.createAccountForHousehold(createdHouseholdId, createAccountDto);
      const initialBalance = Number(account.currentBalance);

      // Create income transaction
      const incomeDto: CreateTransactionHouseholdDTO = {
        accountId: account.id,
        type: 'income',
        amount: 500,
        categoryId: null,
        description: 'Salary payment',
        transactionDate: new Date().toISOString(),
      };

      await transactionsService.createTransactionForHousehold(createdHouseholdId, incomeDto);

      // Reload account and verify balance increased
      const updatedAccount = await accountsService.findAccountById(account.id);
      const expectedBalance = initialBalance + incomeDto.amount;
      expect(Number(updatedAccount.currentBalance)).toBe(expectedBalance);
    });

    it('should correctly handle multiple transactions (expense then income)', async () => {
      // Create account with initial balance
      const createAccountDto: CreateAccountHouseholdScopedDTO = {
        name: 'Test Account',
        type: 'checking',
        initialBalance: 1000,
        ownerId: createdUserId,
      };

      const account = await accountsService.createAccountForHousehold(createdHouseholdId, createAccountDto);
      let currentBalance = Number(account.currentBalance);

      // Create a category for the expense
      const categoryRepository = dataSource.getRepository(Category);
      const category = categoryRepository.create({
        householdId: createdHouseholdId,
        name: 'Utilities',
        description: 'Utility bills',
      });
      const savedCategory = await categoryRepository.save(category);

      // Create expense transaction
      const expenseAmount = 200;
      const expenseDto: CreateTransactionHouseholdDTO = {
        accountId: account.id,
        type: 'expense',
        amount: expenseAmount,
        categoryId: savedCategory.id,
        description: 'Electricity bill',
        transactionDate: new Date().toISOString(),
      };

      await transactionsService.createTransactionForHousehold(createdHouseholdId, expenseDto);
      currentBalance -= expenseAmount;

      // Verify balance after expense
      let updatedAccount = await accountsService.findAccountById(account.id);
      expect(Number(updatedAccount.currentBalance)).toBe(currentBalance);

      // Create income transaction
      const incomeAmount = 1500;
      const incomeDto: CreateTransactionHouseholdDTO = {
        accountId: account.id,
        type: 'income',
        amount: incomeAmount,
        categoryId: null,
        description: 'Monthly salary',
        transactionDate: new Date().toISOString(),
      };

      await transactionsService.createTransactionForHousehold(createdHouseholdId, incomeDto);
      currentBalance += incomeAmount;

      // Verify final balance
      updatedAccount = await accountsService.findAccountById(account.id);
      expect(Number(updatedAccount.currentBalance)).toBe(currentBalance);
      expect(Number(updatedAccount.currentBalance)).toBe(1000 - 200 + 1500);
      expect(Number(updatedAccount.currentBalance)).toBe(2300);
    });
  });

  describe('Unique Account Name per Household', () => {
    it('should reject duplicate account name in the same household', async () => {
      const accountDto: CreateAccountHouseholdScopedDTO = {
        name: 'Tekući račun',
        type: 'checking',
        initialBalance: 1000,
        ownerId: createdUserId,
      };

      // Create first account
      await accountsService.createAccountForHousehold(createdHouseholdId, accountDto);

      // Try to create second account with same name in same household
      await expect(accountsService.createAccountForHousehold(createdHouseholdId, accountDto)).rejects.toThrow(
        ConflictException,
      );

      await expect(accountsService.createAccountForHousehold(createdHouseholdId, accountDto)).rejects.toThrow(
        'Naziv računa već postoji u ovom domaćinstvu',
      );
    });

    it('should allow same account name in different households', async () => {
      // Create a second license for the second household
      const licenseRepository = dataSource.getRepository(License);
      const testLicense2 = licenseRepository.create({
        expiresAt: addYears(new Date(), 1),
        note: 'Second test license for accounts integration tests',
      });
      const savedLicense2 = await licenseRepository.save(testLicense2);

      // Create second household
      const household2 = await householdsService.createHousehold({
        name: 'Second Test Household',
        currencyCode: 'EUR',
        licenseId: savedLicense2.id,
      });

      // Create user in second household
      const userRepository = dataSource.getRepository(User);
      const user2 = userRepository.create({
        householdId: household2.id,
        username: 'testuser2',
        email: 'testuser2@example.com',
        passwordHash: 'hashedpassword',
        isHouseholdAuthor: false,
      });
      const savedUser2 = await userRepository.save(user2);

      const accountDto: CreateAccountHouseholdScopedDTO = {
        name: 'Tekući račun',
        type: 'checking',
        initialBalance: 1000,
        ownerId: createdUserId,
      };

      // Create account in first household
      const account1 = await accountsService.createAccountForHousehold(createdHouseholdId, accountDto);
      expect(account1).toBeDefined();
      expect(account1.householdId).toBe(createdHouseholdId);

      // Create account with same name in second household
      const accountDto2: CreateAccountHouseholdScopedDTO = {
        name: 'Tekući račun',
        type: 'checking',
        initialBalance: 2000,
        ownerId: savedUser2.id,
      };

      const account2 = await accountsService.createAccountForHousehold(household2.id, accountDto2);
      expect(account2).toBeDefined();
      expect(account2.householdId).toBe(household2.id);
      expect(account2.name).toBe(account1.name);
      expect(account2.id).not.toBe(account1.id);
    });
  });
});
