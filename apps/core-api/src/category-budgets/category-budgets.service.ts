import {Injectable} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {CategoriesService} from 'src/categories/categories.service';
import {CategoryBudgetsRepository} from './category-budgets.repository';
import {CategoryBudgetContract} from '@maya-vault/contracts';
import {BadRequestException, ForbiddenException, NotFoundException} from '@nestjs/common';
import {EditCategoryBudgetDTO} from '@maya-vault/contracts';

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

  async updateCategoryBudget(userId: string, id: string, dto: EditCategoryBudgetDTO): Promise<CategoryBudgetContract> {
    const me = await this.usersService.findUserById(userId);
    const budget = await this.categoryBudgetsRepository.findById(id);
    if (!budget) {
      throw new NotFoundException('Category budget not found');
    }

    if (budget.householdId !== me.householdId) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    if (dto.plannedAmount < 0) {
      throw new BadRequestException('plannedAmount must be 0 or greater');
    }

    const updated = await this.categoryBudgetsRepository.updatePlannedAmount(id, dto.plannedAmount);
    if (!updated) {
      throw new NotFoundException('Category budget not found');
    }

    return updated as CategoryBudgetContract;
  }
}
