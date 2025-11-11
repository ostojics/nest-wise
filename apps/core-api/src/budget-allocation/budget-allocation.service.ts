import {
  BudgetAllocationContract,
  BudgetAllocationWithCalculationsContract,
  CreateBudgetAllocationDTO,
  UpdateBudgetAllocationDTO,
} from '@nest-wise/contracts';
import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {BudgetAllocationRepository} from './budget-allocation.repository';
import {BudgetAllocation} from './budget-allocation.entity';
import {format} from 'date-fns';
import {UTCDate} from '@date-fns/utc';

@Injectable()
export class BudgetAllocationService {
  constructor(private readonly budgetAllocationRepository: BudgetAllocationRepository) {}

  async getByHouseholdAndMonth(
    householdId: string,
    month?: string,
  ): Promise<BudgetAllocationWithCalculationsContract | null> {
    const targetMonth = month ?? this.getCurrentMonth();
    const allocation = await this.budgetAllocationRepository.findByHouseholdAndMonth(householdId, targetMonth);

    if (!allocation) {
      return null;
    }

    return this.calculateDerivedValues(allocation);
  }

  async create(householdId: string, dto: CreateBudgetAllocationDTO): Promise<BudgetAllocationWithCalculationsContract> {
    // Validate percentages sum to 100 (schema already does this but double-check)
    this.validateCategories(dto.categories);

    // Check if allocation already exists for this month
    const existing = await this.budgetAllocationRepository.findByHouseholdAndMonth(householdId, dto.month);
    if (existing) {
      throw new ConflictException('Alokacija budžeta za ovaj mesec već postoji');
    }

    const allocation = await this.budgetAllocationRepository.createBudgetAllocation(householdId, dto);
    return this.calculateDerivedValues(allocation);
  }

  async update(id: string, dto: UpdateBudgetAllocationDTO): Promise<BudgetAllocationWithCalculationsContract> {
    const existing = await this.budgetAllocationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Alokacija budžeta nije pronađena');
    }

    // If categories are updated, validate they sum to 100
    if (dto.categories) {
      this.validateCategories(dto.categories);
    }

    const updated = await this.budgetAllocationRepository.updateBudgetAllocation(id, dto);
    if (!updated) {
      throw new NotFoundException('Alokacija budžeta nije pronađena');
    }

    return this.calculateDerivedValues(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.budgetAllocationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Alokacija budžeta nije pronađena');
    }

    await this.budgetAllocationRepository.deleteBudgetAllocation(id);
  }

  async findById(id: string): Promise<BudgetAllocationContract> {
    const allocation = await this.budgetAllocationRepository.findById(id);
    if (!allocation) {
      throw new NotFoundException('Alokacija budžeta nije pronađena');
    }

    return allocation as BudgetAllocationContract;
  }

  private calculateDerivedValues(allocation: BudgetAllocation): BudgetAllocationWithCalculationsContract {
    const remainder = allocation.salaryAmount - allocation.fixedBillsAmount;

    const categoryAllocations = allocation.categories
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((category) => ({
        id: category.id,
        name: category.name,
        percentage: category.percentage,
        amount: this.roundToTwoDecimals((remainder * category.percentage) / 100),
        displayOrder: category.displayOrder,
      }));

    return {
      ...allocation,
      remainder: this.roundToTwoDecimals(remainder),
      categoryAllocations,
    };
  }

  private validateCategories(categories: {name: string; percentage: number}[]): void {
    const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (totalPercentage !== 100) {
      throw new BadRequestException('Procenti moraju biti tačno 100%');
    }
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private getCurrentMonth(): string {
    return format(new UTCDate(), 'yyyy-MM');
  }
}
