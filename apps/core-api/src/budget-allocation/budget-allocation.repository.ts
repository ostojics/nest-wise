import {Injectable} from '@nestjs/common';
import {DataSource, Repository} from 'typeorm';
import {BudgetAllocation} from './budget-allocation.entity';
import {BudgetAllocationCategory} from './budget-allocation-category.entity';
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
      relations: ['categories'],
    });
  }

  async findById(id: string): Promise<BudgetAllocation | null> {
    return this.findOne({
      where: {id},
      relations: ['categories'],
    });
  }

  async createBudgetAllocation(householdId: string, dto: CreateBudgetAllocationDTO): Promise<BudgetAllocation> {
    const allocation = this.create({
      householdId,
      month: dto.month,
      salaryAmount: dto.salaryAmount,
      fixedBillsAmount: dto.fixedBillsAmount,
      categories: dto.categories.map((cat) =>
        this.manager.create(BudgetAllocationCategory, {
          name: cat.name,
          percentage: cat.percentage,
          displayOrder: cat.displayOrder,
        }),
      ),
    });

    return this.save(allocation);
  }

  async updateBudgetAllocation(id: string, dto: UpdateBudgetAllocationDTO): Promise<BudgetAllocation | null> {
    const allocation = await this.findById(id);
    if (!allocation) {
      return null;
    }

    // Update basic fields
    if (dto.month !== undefined) allocation.month = dto.month;
    if (dto.salaryAmount !== undefined) allocation.salaryAmount = dto.salaryAmount;
    if (dto.fixedBillsAmount !== undefined) allocation.fixedBillsAmount = dto.fixedBillsAmount;

    // Update categories if provided
    if (dto.categories) {
      // Remove old categories
      await this.manager.delete(BudgetAllocationCategory, {budgetAllocationId: id});

      // Add new categories
      allocation.categories = dto.categories.map((cat) =>
        this.manager.create(BudgetAllocationCategory, {
          budgetAllocationId: id,
          name: cat.name,
          percentage: cat.percentage,
          displayOrder: cat.displayOrder,
        }),
      );
    }

    return this.save(allocation);
  }

  async deleteBudgetAllocation(id: string): Promise<void> {
    await this.delete(id);
  }
}
