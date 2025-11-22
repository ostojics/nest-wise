import {Injectable, Inject} from '@nestjs/common';
import {CategoryBudgetWithCurrentAmountContract} from '@nest-wise/contracts';
import {IUseCase} from '../base-use-case';
import {CategoriesService} from '../../../categories/categories.service';
import {TransactionsService} from '../../../transactions/transactions.service';
import {TransactionType} from '../../../common/enums/transaction.type.enum';
import {endOfMonth, format, startOfMonth} from 'date-fns';
import {
  ICategoryBudgetRepository,
  CATEGORY_BUDGET_REPOSITORY,
} from '../../../repositories/category-budget.repository.interface';

export interface GetCategoryBudgetsForHouseholdInput {
  householdId: string;
  month: string;
}

@Injectable()
export class GetCategoryBudgetsForHouseholdUseCase
  implements IUseCase<GetCategoryBudgetsForHouseholdInput, CategoryBudgetWithCurrentAmountContract[]>
{
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(CATEGORY_BUDGET_REPOSITORY)
    private readonly categoryBudgetsRepository: ICategoryBudgetRepository,
    private readonly transactionsService: TransactionsService,
  ) {}

  async execute(input: GetCategoryBudgetsForHouseholdInput): Promise<CategoryBudgetWithCurrentAmountContract[]> {
    const {householdId, month} = input;

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
      category: {
        name: b.category.name,
        description: b.category.description ?? null,
      },
      currentAmount: spentByCategory.get(b.categoryId) ?? 0,
    }));

    return mapped;
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
