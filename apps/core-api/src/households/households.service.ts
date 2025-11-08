import {Injectable, NotFoundException} from '@nestjs/common';
import {HouseholdsRepository} from './households.repository';
import {Household} from './household.entity';
import {AccountsService} from 'src/accounts/accounts.service';
import {Account} from 'src/accounts/account.entity';
import type {CreateHouseholdDTO, UpdateHouseholdDTO} from '@nest-wise/contracts';
import {CategoriesService} from 'src/categories/categories.service';
import {Category} from 'src/categories/categories.entity';

@Injectable()
export class HouseholdsService {
  constructor(
    private readonly householdsRepository: HouseholdsRepository,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createHousehold(householdData: CreateHouseholdDTO & {licenseId: string}): Promise<Household> {
    return await this.householdsRepository.create({
      name: householdData.name,
      currencyCode: householdData.currencyCode,
      licenseId: householdData.licenseId,
    });
  }

  async findHouseholdById(id: string): Promise<Household> {
    const household = await this.householdsRepository.findById(id);
    if (!household) {
      throw new NotFoundException('Domaćinstvo nije pronađeno');
    }

    return household;
  }

  async findHouseholdByIdWithUsers(id: string): Promise<Household> {
    const household = await this.householdsRepository.findByIdWithUsers(id);
    if (!household) {
      throw new NotFoundException('Domaćinstvo nije pronađeno');
    }
    return household;
  }

  async findAllHouseholds(): Promise<Household[]> {
    return await this.householdsRepository.findAll();
  }

  async updateHousehold(id: string, householdData: UpdateHouseholdDTO): Promise<Household> {
    const existingHousehold = await this.householdsRepository.findById(id);
    if (!existingHousehold) {
      throw new NotFoundException('Domaćinstvo nije pronađeno');
    }

    const updateData: Partial<Household> = {};
    if (householdData.name !== undefined) {
      updateData.name = householdData.name;
    }
    if (householdData.currencyCode !== undefined) {
      updateData.currencyCode = householdData.currencyCode;
    }
    if (householdData.monthlyBudget !== undefined) {
      updateData.monthlyBudget = householdData.monthlyBudget;
    }

    const updatedHousehold = await this.householdsRepository.update(id, updateData);
    if (!updatedHousehold) {
      throw new NotFoundException('Domaćinstvo nije pronađeno');
    }

    return updatedHousehold;
  }

  async deleteHousehold(id: string): Promise<void> {
    const deleted = await this.householdsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Household not found');
    }
  }

  async findAccountsByHouseholdId(householdId: string, options?: {isActive?: boolean}): Promise<Account[]> {
    const household = await this.householdsRepository.findById(householdId);
    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return await this.accountsService.findAccountsByHouseholdId(householdId, options);
  }

  async findCategoriesByHouseholdId(householdId: string): Promise<Category[]> {
    const household = await this.householdsRepository.findById(householdId);
    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return await this.categoriesService.findCategoriesByHouseholdId(householdId);
  }
}
