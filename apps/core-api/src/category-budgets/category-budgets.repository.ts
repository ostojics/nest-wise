import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CategoryBudget} from './category-budgets.entity';

@Injectable()
export class CategoryBudgetsRepository {
  constructor(
    @InjectRepository(CategoryBudget)
    private readonly categoryBudgetRepository: Repository<CategoryBudget>,
  ) {}

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
          isDefault: true,
        },
      },
    });
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

  async updatePlannedAmount(id: string, plannedAmount: number): Promise<CategoryBudget | null> {
    const result = await this.categoryBudgetRepository.update(id, {plannedAmount});
    if ((result.affected ?? 0) === 0) {
      return null;
    }

    return await this.findById(id);
  }
}
