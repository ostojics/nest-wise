import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CategoryBudget} from './category-budgets.entity';
import {ICategoryBudgetRepository} from '../repositories/category-budget.repository.interface';

@Injectable()
export class CategoryBudgetsRepository implements ICategoryBudgetRepository {
  constructor(
    @InjectRepository(CategoryBudget)
    private readonly categoryBudgetRepository: Repository<CategoryBudget>,
  ) {}

  async create(budgetData: Partial<CategoryBudget>): Promise<CategoryBudget> {
    const budget = this.categoryBudgetRepository.create(budgetData);
    return await this.categoryBudgetRepository.save(budget);
  }

  async createMany(budgets: Partial<CategoryBudget>[]): Promise<CategoryBudget[]> {
    const entities = this.categoryBudgetRepository.create(budgets);
    return await this.categoryBudgetRepository.save(entities);
  }

  async findById(id: string): Promise<CategoryBudget | null> {
    return await this.categoryBudgetRepository.findOne({
      where: {id},
      relations: {category: true},
      select: {category: {name: true}},
    });
  }

  async findByIdAndHousehold(id: string, householdId: string): Promise<CategoryBudget | null> {
    return await this.categoryBudgetRepository.findOne({
      where: {id, householdId},
      relations: {category: true},
      select: {category: {name: true}},
    });
  }

  async findByHousehold(householdId: string): Promise<CategoryBudget[]> {
    return await this.categoryBudgetRepository.find({
      where: {householdId},
      order: {createdAt: 'ASC'},
      relations: {category: true},
      select: {
        category: {
          name: true,
          description: true,
        },
      },
    });
  }

  async findByHouseholdAndMonth(householdId: string, month: string): Promise<CategoryBudget[]> {
    return await this.categoryBudgetRepository.find({
      where: {householdId, month},
      order: {createdAt: 'ASC'},
      relations: {
        category: true,
      },
      select: {
        category: {
          name: true,
          description: true,
        },
      },
    });
  }

  async findByCategoryAndPeriod(categoryId: string, month: string): Promise<CategoryBudget | null> {
    return await this.categoryBudgetRepository.findOne({
      where: {categoryId, month},
      relations: {category: true},
    });
  }

  async update(id: string, budgetData: Partial<CategoryBudget>): Promise<CategoryBudget | null> {
    const result = await this.categoryBudgetRepository.update(id, budgetData);
    if ((result.affected ?? 0) === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async updatePlannedAmount(id: string, plannedAmount: number): Promise<CategoryBudget | null> {
    const result = await this.categoryBudgetRepository.update(id, {plannedAmount});
    if ((result.affected ?? 0) === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.categoryBudgetRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }
}
