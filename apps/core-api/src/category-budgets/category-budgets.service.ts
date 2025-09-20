import {
  CategoryBudgetContract,
  CategoryBudgetWithCurrentAmountContract,
  EditCategoryBudgetDTO,
} from '@nest-wise/contracts';
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CategoriesService} from 'src/categories/categories.service';
import {UsersService} from 'src/users/users.service';
import {CategoryBudgetsRepository} from './category-budgets.repository';
import {endOfMonth, format, isBefore, startOfMonth} from 'date-fns';
import {TransactionsService} from 'src/transactions/transactions.service';
import {TransactionType} from 'src/common/enums/transaction.type.enum';
import {UTCDate} from '@date-fns/utc';

@Injectable()
export class CategoryBudgetsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly categoryBudgetsRepository: CategoryBudgetsRepository,
    private readonly transactionsService: TransactionsService,
  ) {}

  async getCategoryBudgetsForMonth(userId: string, month: string): Promise<CategoryBudgetWithCurrentAmountContract[]> {
    const me = await this.usersService.findUserById(userId);
    return this.getCategoryBudgetsForHousehold(me.householdId, month);
  }

  async getCategoryBudgetsForHousehold(
    householdId: string,
    month: string,
  ): Promise<CategoryBudgetWithCurrentAmountContract[]> {
    const [categories, budgets] = await Promise.all([
      this.categoriesService.findCategoriesByHouseholdId(householdId),
      this.categoryBudgetsRepository.findByHouseholdAndMonth(householdId, month),
    ]);

    const existingCategoryIds = new Set(budgets.map((b) => b.categoryId));
    const missing = categories.filter((c) => !existingCategoryIds.has(c.id));

    if (missing.length > 0) {
      await this.categoryBudgetsRepository.createMany(
        missing.map((c) => ({
          householdId,
          categoryId: c.id,
          month,
          plannedAmount: 0,
        })),
      );
    }

    const all = await this.categoryBudgetsRepository.findByHouseholdAndMonth(householdId, month);

    const {start: dateFrom, end: dateTo} = this.getCurrentMonthRange(month);
    const transactions = await this.transactionsService.findAllTransactions({
      householdId,
      transactionDate_from: dateFrom,
      transactionDate_to: dateTo,
      type: TransactionType.EXPENSE,
    });

    const spentByCategory = new Map<string, number>();
    for (const tx of transactions) {
      if (!tx.categoryId) continue;

      const prev = spentByCategory.get(tx.categoryId) ?? 0;
      spentByCategory.set(tx.categoryId, prev + Number(tx.amount));
    }

    const mapped: CategoryBudgetWithCurrentAmountContract[] = all.map((b) => ({
      ...b,
      currentAmount: spentByCategory.get(b.categoryId) ?? 0,
    }));

    return mapped;
  }

  async findCategoryBudgetById(id: string): Promise<CategoryBudgetContract> {
    const budget = await this.categoryBudgetsRepository.findById(id);
    if (!budget) {
      throw new NotFoundException('Category budget not found');
    }

    return budget as CategoryBudgetContract;
  }

  async updateCategoryBudget(id: string, dto: EditCategoryBudgetDTO): Promise<CategoryBudgetContract> {
    const categoryBudget = await this.findCategoryBudgetById(id);
    const currentDate = new UTCDate();
    const categoryBudgetMonth = new UTCDate(categoryBudget.month);
    const startOfBudgetMonth = startOfMonth(categoryBudgetMonth);
    const startOfCurrentMonth = startOfMonth(currentDate);

    if (isBefore(startOfBudgetMonth, startOfCurrentMonth)) {
      throw new BadRequestException('Cannot edit a category budget for a past month');
    }

    const updated = await this.categoryBudgetsRepository.updatePlannedAmount(id, dto.plannedAmount);
    if (!updated) {
      throw new NotFoundException('Category budget not found');
    }

    return updated as CategoryBudgetContract;
  }

  private getCurrentMonthRange(currentMonth: string): {start: string; end: string} {
    const date = new Date(currentMonth);
    const dateFormat = 'yyyy-MM-dd';

    return {
      start: format(startOfMonth(date), dateFormat),
      end: format(endOfMonth(date), dateFormat),
    };
  }
}
