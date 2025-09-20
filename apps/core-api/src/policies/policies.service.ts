import {Injectable} from '@nestjs/common';
import {AccountsService} from 'src/accounts/accounts.service';
import {CategoryBudgetsService} from 'src/category-budgets/category-budgets.service';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly categoryBudgetsService: CategoryBudgetsService,
  ) {}

  async canUserUpdateAccount(userId: string, accountId: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    const account = await this.accountsService.findAccountById(accountId);
    return user.householdId === account.householdId;
  }

  async canUserTransferBetweenAccounts(userId: string, fromAccountId: string, toAccountId: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    const fromAccount = await this.accountsService.findAccountById(fromAccountId);
    const toAccount = await this.accountsService.findAccountById(toAccountId);

    const sameHousehold = fromAccount.householdId === toAccount.householdId;
    const belongsToUserHousehold =
      user.householdId === fromAccount.householdId && user.householdId === toAccount.householdId;

    return sameHousehold && belongsToUserHousehold;
  }

  async canUserUpdateCategoryBudget(userId: string, categoryBudgetId: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    const categoryBudget = await this.categoryBudgetsService.findCategoryBudgetById(categoryBudgetId);
    return user.householdId === categoryBudget.householdId;
  }

  async canUserAccessHousehold(userId: string, householdId: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    return user.householdId === householdId;
  }
}
