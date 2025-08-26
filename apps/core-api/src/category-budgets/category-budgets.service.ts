import {CategoryBudgetContract, EditCategoryBudgetDTO} from '@maya-vault/contracts';
import {Injectable, NotFoundException} from '@nestjs/common';
import {CategoriesService} from 'src/categories/categories.service';
import {UsersService} from 'src/users/users.service';
import {CategoryBudgetsRepository} from './category-budgets.repository';

@Injectable()
export class CategoryBudgetsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly categoryBudgetsRepository: CategoryBudgetsRepository,
  ) {}

  async getCategoryBudgetsForMonth(userId: string, month: string): Promise<CategoryBudgetContract[]> {
    const me = await this.usersService.findUserById(userId);
    const [categories, budgets] = await Promise.all([
      this.categoriesService.findCategoriesByHouseholdId(me.householdId),
      this.categoryBudgetsRepository.findByHouseholdAndMonth(me.householdId, month),
    ]);

    const existingCategoryIds = new Set(budgets.map((b) => b.categoryId));
    const missing = categories.filter((c) => !existingCategoryIds.has(c.id));

    if (missing.length > 0) {
      await this.categoryBudgetsRepository.createMany(
        missing.map((c) => ({
          householdId: me.householdId,
          categoryId: c.id,
          month,
          plannedAmount: 0,
        })),
      );
    }

    const all = await this.categoryBudgetsRepository.findByHouseholdAndMonth(me.householdId, month);
    return all as CategoryBudgetContract[];
  }

  async findCategoryBudgetById(id: string): Promise<CategoryBudgetContract> {
    const budget = await this.categoryBudgetsRepository.findById(id);
    if (!budget) {
      throw new NotFoundException('Category budget not found');
    }

    return budget as CategoryBudgetContract;
  }

  async updateCategoryBudget(id: string, dto: EditCategoryBudgetDTO): Promise<CategoryBudgetContract> {
    await this.findCategoryBudgetById(id);

    const updated = await this.categoryBudgetsRepository.updatePlannedAmount(id, dto.plannedAmount);
    if (!updated) {
      throw new NotFoundException('Category budget not found');
    }

    return updated as CategoryBudgetContract;
  }
}
