import {Injectable} from '@nestjs/common';
import {DataSource, Repository} from 'typeorm';
import {BudgetAllocation} from './budget-allocation.entity';
import {CreateBudgetAllocationDTO, UpdateBudgetAllocationDTO} from '@nest-wise/contracts';

@Injectable()
export class BudgetAllocationRepository extends Repository<BudgetAllocation> {
  constructor(private dataSource: DataSource) {
    super(BudgetAllocation, dataSource.createEntityManager());
  }

  async findByHouseholdAndMonth(householdId: string, month: string): Promise<BudgetAllocation | null> {
    return this.findOne({
      where: {
        householdId,
        month,
      },
    });
  }

  async findById(id: string): Promise<BudgetAllocation | null> {
    return this.findOne({
      where: {id},
    });
  }

  async createBudgetAllocation(householdId: string, dto: CreateBudgetAllocationDTO): Promise<BudgetAllocation> {
    const allocation = this.create({
      householdId,
      ...dto,
    });

    return this.save(allocation);
  }

  async updateBudgetAllocation(id: string, dto: UpdateBudgetAllocationDTO): Promise<BudgetAllocation | null> {
    await this.update(id, dto);
    return this.findById(id);
  }

  async deleteBudgetAllocation(id: string): Promise<void> {
    await this.delete(id);
  }
}
