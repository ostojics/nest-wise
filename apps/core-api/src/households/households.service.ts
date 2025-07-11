import {Injectable, NotFoundException} from '@nestjs/common';
import {HouseholdsRepository} from './households.repository';
import {Household} from './household.entity';
import type {CreateHouseholdDTO, UpdateHouseholdDTO} from '@maya-vault/validation';

@Injectable()
export class HouseholdsService {
  constructor(private readonly householdsRepository: HouseholdsRepository) {}

  async createHousehold(householdData: CreateHouseholdDTO): Promise<Household> {
    return await this.householdsRepository.create({
      name: householdData.name,
      currencyCode: householdData.currencyCode,
    });
  }

  async findHouseholdById(id: string): Promise<Household> {
    const household = await this.householdsRepository.findById(id);
    if (!household) {
      throw new NotFoundException('Household not found');
    }
    return household;
  }

  async findHouseholdByIdWithUsers(id: string): Promise<Household> {
    const household = await this.householdsRepository.findByIdWithUsers(id);
    if (!household) {
      throw new NotFoundException('Household not found');
    }
    return household;
  }

  async findAllHouseholds(): Promise<Household[]> {
    return await this.householdsRepository.findAll();
  }

  async updateHousehold(id: string, householdData: UpdateHouseholdDTO): Promise<Household> {
    const existingHousehold = await this.householdsRepository.findById(id);
    if (!existingHousehold) {
      throw new NotFoundException('Household not found');
    }

    const updateData: Partial<Household> = {};
    if (householdData.name !== undefined) {
      updateData.name = householdData.name;
    }
    if (householdData.currencyCode !== undefined) {
      updateData.currencyCode = householdData.currencyCode;
    }

    const updatedHousehold = await this.householdsRepository.update(id, updateData);
    if (!updatedHousehold) {
      throw new NotFoundException('Household not found');
    }

    return updatedHousehold;
  }

  async deleteHousehold(id: string): Promise<void> {
    const deleted = await this.householdsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Household not found');
    }
  }
}
