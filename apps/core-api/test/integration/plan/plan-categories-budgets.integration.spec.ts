import {Test, TestingModule} from '@nestjs/testing';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {addYears, format} from 'date-fns';
import {ConflictException, BadRequestException} from '@nestjs/common';
import {CategoriesService} from '../../../src/categories/categories.service';
import {CategoriesRepository} from '../../../src/categories/categories.repository';
import {CategoryBudgetsService} from '../../../src/category-budgets/category-budgets.service';
import {CategoryBudgetsRepository} from '../../../src/category-budgets/category-budgets.repository';
import {TransactionsService} from '../../../src/transactions/transactions.service';
import {UsersService} from '../../../src/users/users.service';
import {Category} from '../../../src/categories/categories.entity';
import {CategoryBudget} from '../../../src/category-budgets/category-budgets.entity';
import {Household} from '../../../src/households/household.entity';
import {License} from '../../../src/licenses/license.entity';
import {CreateCategoryDTO} from '@nest-wise/contracts';
import {INTEGRATION_TEST_ENTITIES, getConfigModuleConfig, getTypeOrmModuleConfig, cleanupTestData} from '../test-utils';

describe('Integration - Plan: Categories & Budgets', () => {
  let module: TestingModule;
  let categoriesService: CategoriesService;
  let categoryBudgetsService: CategoryBudgetsService;
  let dataSource: DataSource;
  let createdLicenseId: string;
  let createdHouseholdId: string;

  // Mock TransactionsService
  const mockTransactionsService = {
    findAllTransactions: jest.fn().mockResolvedValue([]),
  };

  // Mock UsersService
  const mockUsersService = {
    findUserById: jest.fn().mockResolvedValue({id: 'mock-user-id', householdId: 'mock-household-id'}),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModuleConfig(), getTypeOrmModuleConfig(), TypeOrmModule.forFeature(INTEGRATION_TEST_ENTITIES)],
      providers: [
        CategoriesService,
        CategoriesRepository,
        CategoryBudgetsService,
        CategoryBudgetsRepository,
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoryBudgetsService = module.get<CategoryBudgetsService>(CategoryBudgetsService);
    dataSource = module.get<DataSource>(DataSource);

    // Create a test license for the household
    const licenseRepository = dataSource.getRepository(License);
    const testLicense = licenseRepository.create({
      expiresAt: addYears(new Date(), 1), // 1 year from now
      note: 'Test license for plan categories & budgets integration tests',
    });
    const savedLicense = await licenseRepository.save(testLicense);
    createdLicenseId = savedLicense.id;

    // Create a test household
    const householdRepository = dataSource.getRepository(Household);
    const testHousehold = householdRepository.create({
      name: 'Test Household for Plan',
      currencyCode: 'USD',
      licenseId: createdLicenseId,
    });
    const savedHousehold = await householdRepository.save(testHousehold);
    createdHouseholdId = savedHousehold.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    // Clean up categories and budgets before each test
    await cleanupTestData(dataSource, [CategoryBudget, Category]);
    // Reset mock
    mockTransactionsService.findAllTransactions.mockClear();
    mockTransactionsService.findAllTransactions.mockResolvedValue([]);
  });

  describe('Categories', () => {
    it('should create category for household succeeds with valid data', async () => {
      const createCategoryDto: CreateCategoryDTO = {
        name: 'Hrana',
        description: 'Namirnice i hrana',
      };

      const category = await categoriesService.createCategoryForHousehold(createdHouseholdId, createCategoryDto);

      // Verify returned category
      expect(category).toBeDefined();
      expect(category.id).toBeDefined();
      expect(category.name).toBe(createCategoryDto.name);
      expect(category.description).toBe(createCategoryDto.description);
      expect(category.householdId).toBe(createdHouseholdId);
      expect(category.createdAt).toBeDefined();
      expect(category.updatedAt).toBeDefined();

      // Verify persistence in database
      const categoryRepository = dataSource.getRepository(Category);
      const persistedCategory = await categoryRepository.findOne({
        where: {id: category.id},
      });

      expect(persistedCategory).toBeDefined();
      expect(persistedCategory!.name).toBe(createCategoryDto.name);
      expect(persistedCategory!.householdId).toBe(createdHouseholdId);
    });

    it('should create category fails when name already exists for household', async () => {
      const categoryName = 'Transport';

      // Create first category
      const firstCategoryDto: CreateCategoryDTO = {
        name: categoryName,
      };

      await categoriesService.createCategoryForHousehold(createdHouseholdId, firstCategoryDto);

      // Attempt to create second category with same name
      const secondCategoryDto: CreateCategoryDTO = {
        name: categoryName,
      };

      await expect(categoriesService.createCategoryForHousehold(createdHouseholdId, secondCategoryDto)).rejects.toThrow(
        ConflictException,
      );

      await expect(categoriesService.createCategoryForHousehold(createdHouseholdId, secondCategoryDto)).rejects.toThrow(
        'Naziv kategorije već postoji u ovom domaćinstvu',
      );

      // Verify only one category exists in DB
      const categoryRepository = dataSource.getRepository(Category);
      const categories = await categoryRepository.find({
        where: {householdId: createdHouseholdId, name: categoryName},
      });
      expect(categories.length).toBe(1);
    });

    it('should create multiple categories for household', async () => {
      const categoryNames = ['Hrana', 'Transport', 'Režije'];

      // Create 3 categories
      const createdCategories = await Promise.all(
        categoryNames.map((name) => categoriesService.createCategoryForHousehold(createdHouseholdId, {name})),
      );

      // Verify all 3 categories exist
      expect(createdCategories.length).toBe(3);

      // Each has unique ID
      const ids = createdCategories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);

      // All have correct householdId
      createdCategories.forEach((category) => {
        expect(category.householdId).toBe(createdHouseholdId);
      });

      // Verify persistence in database
      const categoryRepository = dataSource.getRepository(Category);
      const persistedCategories = await categoryRepository.find({
        where: {householdId: createdHouseholdId},
      });
      expect(persistedCategories.length).toBe(3);

      const persistedNames = persistedCategories.map((c) => c.name).sort();
      expect(persistedNames).toEqual(categoryNames.sort());
    });
  });

  describe('Category Budgets', () => {
    it('should get category budgets auto-creates zero budgets for new categories', async () => {
      // Create 2 categories
      const category1 = await categoriesService.createCategoryForHousehold(createdHouseholdId, {name: 'Hrana'});
      const category2 = await categoriesService.createCategoryForHousehold(createdHouseholdId, {name: 'Transport'});

      const currentMonth = format(new Date(), 'yyyy-MM'); // e.g., "2024-01"

      // Get budgets for current month
      const budgets = await categoryBudgetsService.getCategoryBudgetsForHousehold(createdHouseholdId, currentMonth);

      // Verify 2 budgets are returned
      expect(budgets).toBeDefined();
      expect(budgets.length).toBe(2);

      // Verify both have plannedAmount = 0, currentAmount = 0
      budgets.forEach((budget) => {
        expect(budget.plannedAmount).toBe(0);
        expect(budget.currentAmount).toBe(0);
        expect(budget.month).toBe(currentMonth);
        expect(budget.householdId).toBe(createdHouseholdId);
      });

      // Verify budgets are persisted in DB
      const budgetRepository = dataSource.getRepository(CategoryBudget);
      const persistedBudgets = await budgetRepository.find({
        where: {householdId: createdHouseholdId, month: currentMonth},
      });
      expect(persistedBudgets.length).toBe(2);

      const categoryIds = persistedBudgets.map((b) => b.categoryId).sort();
      expect(categoryIds).toContain(category1.id);
      expect(categoryIds).toContain(category2.id);
    });

    it('should update category budget planned amount succeeds', async () => {
      // Create category
      const category = await categoriesService.createCategoryForHousehold(createdHouseholdId, {name: 'Hrana'});

      const currentMonth = format(new Date(), 'yyyy-MM');

      // Get budgets to auto-create
      const budgets = await categoryBudgetsService.getCategoryBudgetsForHousehold(createdHouseholdId, currentMonth);
      expect(budgets.length).toBe(1);

      const budgetId = budgets[0].id;
      const originalUpdatedAt = budgets[0].updatedAt;

      // Update budget planned amount
      const updatedBudget = await categoryBudgetsService.updateCategoryBudget(budgetId, {plannedAmount: 30000});

      // Verify update
      expect(updatedBudget).toBeDefined();
      expect(updatedBudget.id).toBe(budgetId);
      expect(updatedBudget.plannedAmount).toBe(30000);

      // Verify persistence in DB and updatedAt changed
      const budgetRepository = dataSource.getRepository(CategoryBudget);
      const persistedBudget = await budgetRepository.findOne({where: {id: budgetId}});
      expect(persistedBudget).toBeDefined();
      expect(Number(persistedBudget!.plannedAmount)).toBe(30000);
      expect(persistedBudget!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should update category budget fails for past month', async () => {
      // Create category
      const category = await categoriesService.createCategoryForHousehold(createdHouseholdId, {name: 'Hrana'});

      // Use a month that is definitely in the past
      const pastMonth = '2020-01';

      // Get budgets to auto-create for past month
      const budgets = await categoryBudgetsService.getCategoryBudgetsForHousehold(createdHouseholdId, pastMonth);
      expect(budgets.length).toBe(1);

      const budgetId = budgets[0].id;

      // Attempt to update budget for past month
      await expect(categoryBudgetsService.updateCategoryBudget(budgetId, {plannedAmount: 20000})).rejects.toThrow(
        BadRequestException,
      );

      await expect(categoryBudgetsService.updateCategoryBudget(budgetId, {plannedAmount: 20000})).rejects.toThrow(
        'Nije moguće menjati budžet kategorije za prethodni mesec',
      );
    });
  });
});
