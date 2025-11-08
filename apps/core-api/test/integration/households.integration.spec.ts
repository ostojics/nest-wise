import {Test, TestingModule} from '@nestjs/testing';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {addYears} from 'date-fns';
import {HouseholdsService} from '../../src/households/households.service';
import {HouseholdsRepository} from '../../src/households/households.repository';
import {Household} from '../../src/households/household.entity';
import {License} from '../../src/licenses/license.entity';
import {CreateHouseholdDTO} from '@nest-wise/contracts';
import {
  INTEGRATION_TEST_ENTITIES,
  getConfigModuleConfig,
  getTypeOrmModuleConfig,
  mockAccountsServiceProvider,
  mockCategoriesServiceProvider,
  mockPosthogServiceProvider,
  cleanupTestData,
} from './test-utils';

describe('Integration - Households', () => {
  let module: TestingModule;
  let householdsService: HouseholdsService;
  let dataSource: DataSource;
  let createdLicenseId: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModuleConfig(), getTypeOrmModuleConfig(), TypeOrmModule.forFeature(INTEGRATION_TEST_ENTITIES)],
      providers: [
        HouseholdsService,
        HouseholdsRepository,
        mockAccountsServiceProvider,
        mockCategoriesServiceProvider,
        mockPosthogServiceProvider,
      ],
    }).compile();

    householdsService = module.get<HouseholdsService>(HouseholdsService);
    dataSource = module.get<DataSource>(DataSource);

    // Create a test license for the household creation
    const licenseRepository = dataSource.getRepository(License);
    const testLicense = licenseRepository.create({
      expiresAt: addYears(new Date(), 1), // 1 year from now
      note: 'Test license for integration tests',
    });
    const savedLicense = await licenseRepository.save(testLicense);
    createdLicenseId = savedLicense.id;
  });

  afterAll(async () => {
    // Clean up test data - households and license will be cleaned up by database teardown
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    // Clean up households from previous tests
    await cleanupTestData(dataSource, [Household]);
  });

  describe('Household CRUD Operations', () => {
    it('should create a household successfully', async () => {
      const createHouseholdDto: CreateHouseholdDTO = {
        name: 'Test Household',
        currencyCode: 'USD',
      };

      const household = await householdsService.createHousehold({
        ...createHouseholdDto,
        licenseId: createdLicenseId,
      });

      expect(household).toBeDefined();
      expect(household.id).toBeDefined();
      expect(household.name).toBe(createHouseholdDto.name);
      expect(household.currencyCode).toBe(createHouseholdDto.currencyCode);
      expect(household.licenseId).toBe(createdLicenseId);
      expect(household.createdAt).toBeDefined();
      expect(household.updatedAt).toBeDefined();
    });

    it('should find a household by ID', async () => {
      // First, create a household
      const createHouseholdDto: CreateHouseholdDTO = {
        name: 'Test Household for Find',
        currencyCode: 'EUR',
      };

      const createdHousehold = await householdsService.createHousehold({
        ...createHouseholdDto,
        licenseId: createdLicenseId,
      });

      // Then, find it by ID
      const foundHousehold = await householdsService.findHouseholdById(createdHousehold.id);

      expect(foundHousehold).toBeDefined();
      expect(foundHousehold.id).toBe(createdHousehold.id);
      expect(foundHousehold.name).toBe(createHouseholdDto.name);
      expect(foundHousehold.currencyCode).toBe(createHouseholdDto.currencyCode);
    });

    it('should throw NotFoundException when household not found', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await expect(householdsService.findHouseholdById(nonExistentId)).rejects.toThrow('Domaćinstvo nije pronađeno');
    });

    it('should update a household successfully', async () => {
      // First, create a household
      const createHouseholdDto: CreateHouseholdDTO = {
        name: 'Original Household Name',
        currencyCode: 'USD',
      };

      const createdHousehold = await householdsService.createHousehold({
        ...createHouseholdDto,
        licenseId: createdLicenseId,
      });

      // Then, update it
      const updateData = {
        name: 'Updated Household Name',
        currencyCode: 'GBP',
        monthlyBudget: 1000,
      };

      const updatedHousehold = await householdsService.updateHousehold(createdHousehold.id, updateData);

      expect(updatedHousehold).toBeDefined();
      expect(updatedHousehold.id).toBe(createdHousehold.id);
      expect(updatedHousehold.name).toBe(updateData.name);
      expect(updatedHousehold.currencyCode).toBe(updateData.currencyCode);
      expect(Number(updatedHousehold.monthlyBudget)).toBe(updateData.monthlyBudget);
      expect(updatedHousehold.updatedAt.getTime()).toBeGreaterThan(createdHousehold.updatedAt.getTime());
    });

    it('should find all households', async () => {
      // Create multiple households
      const household1 = await householdsService.createHousehold({
        name: 'Household 1',
        currencyCode: 'USD',
        licenseId: createdLicenseId,
      });

      // Create another license for second household
      const licenseRepository = dataSource.getRepository(License);
      const testLicense2 = licenseRepository.create({
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        note: 'Second test license for integration tests',
      });
      const savedLicense2 = await licenseRepository.save(testLicense2);

      const household2 = await householdsService.createHousehold({
        name: 'Household 2',
        currencyCode: 'EUR',
        licenseId: savedLicense2.id,
      });

      const allHouseholds = await householdsService.findAllHouseholds();

      expect(allHouseholds).toBeDefined();
      expect(allHouseholds.length).toBe(2);

      const householdIds = allHouseholds.map((h) => h.id);
      expect(householdIds).toContain(household1.id);
      expect(householdIds).toContain(household2.id);
    });

    it('should persist household data correctly in database', async () => {
      const createHouseholdDto: CreateHouseholdDTO = {
        name: 'Database Persistence Test',
        currencyCode: 'CAD',
      };

      const household = await householdsService.createHousehold({
        ...createHouseholdDto,
        licenseId: createdLicenseId,
      });

      // Directly query the database to verify persistence
      const householdRepository = dataSource.getRepository(Household);
      const persistedHousehold = await householdRepository.findOne({
        where: {id: household.id},
      });

      expect(persistedHousehold).toBeDefined();
      expect(persistedHousehold!.name).toBe(createHouseholdDto.name);
      expect(persistedHousehold!.currencyCode).toBe(createHouseholdDto.currencyCode);
      expect(persistedHousehold!.licenseId).toBe(createdLicenseId);
    });
  });
});
