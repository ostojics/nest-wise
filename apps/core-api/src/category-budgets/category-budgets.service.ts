import {
  CategoryBudgetContract,
  CategoryBudgetWithCurrentAmountContract,
  EditCategoryBudgetDTO,
} from '@nest-wise/contracts';
import {BadRequestException, Injectable, NotFoundException, Inject} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {endOfMonth, format, isBefore, startOfMonth} from 'date-fns';
import {UTCDate} from '@date-fns/utc';
import {
  ICategoryBudgetRepository,
  CATEGORY_BUDGET_REPOSITORY,
} from '../repositories/category-budget.repository.interface';
import {GetCategoryBudgetsForHouseholdUseCase} from '../application/use-cases/category-budgets';

@Injectable()
export class CategoryBudgetsService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CATEGORY_BUDGET_REPOSITORY)
    private readonly categoryBudgetsRepository: ICategoryBudgetRepository,
    private readonly getCategoryBudgetsForHouseholdUseCase: GetCategoryBudgetsForHouseholdUseCase,
  ) {}

  async getCategoryBudgetsForMonth(userId: string, month: string): Promise<CategoryBudgetWithCurrentAmountContract[]> {
    const me = await this.usersService.findUserById(userId);
    return this.getCategoryBudgetsForHousehold(me.householdId, month);
  }

  async getCategoryBudgetsForHousehold(
    householdId: string,
    month: string,
  ): Promise<CategoryBudgetWithCurrentAmountContract[]> {
    return await this.getCategoryBudgetsForHouseholdUseCase.execute({householdId, month});
  }

  async findCategoryBudgetById(id: string): Promise<CategoryBudgetContract> {
    const budget = await this.categoryBudgetsRepository.findById(id);
    if (!budget) {
      throw new NotFoundException('Budžet kategorije nije pronađen');
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
      throw new BadRequestException('Nije moguće menjati budžet kategorije za prethodni mesec');
    }

    const updated = await this.categoryBudgetsRepository.updatePlannedAmount(id, dto.plannedAmount);
    if (!updated) {
      throw new NotFoundException('Budžet kategorije nije pronađen');
    }

    return updated as CategoryBudgetContract;
  }
}
