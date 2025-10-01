import {Injectable} from '@nestjs/common';
import {Logger} from 'pino-nestjs';
import {AccountsService} from 'src/accounts/accounts.service';
import {CategoriesService} from 'src/categories/categories.service';
import {CategoryBudgetsService} from 'src/category-budgets/category-budgets.service';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly categoryBudgetsService: CategoryBudgetsService,
    private readonly categoriesService: CategoriesService,
    private readonly logger: Logger,
  ) {}

  async canUserUpdateAccount(userId: string, accountId: string): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can update account ${accountId}.`);

    const user = await this.usersService.findUserById(userId);
    const account = await this.accountsService.findAccountById(accountId);
    const result = user.householdId === account.householdId;

    this.logger.debug(`Result for canUserUpdateAccount (userId: ${userId}, accountId: ${accountId}): ${result}`);
    return result;
  }

  async canUserTransferBetweenAccounts(userId: string, fromAccountId: string, toAccountId: string): Promise<boolean> {
    this.logger.debug(
      `Checking if user ${userId} can transfer from account ${fromAccountId} to account ${toAccountId}.`,
    );

    const user = await this.usersService.findUserById(userId);
    const fromAccount = await this.accountsService.findAccountById(fromAccountId);
    const toAccount = await this.accountsService.findAccountById(toAccountId);

    const sameHousehold = fromAccount.householdId === toAccount.householdId;
    const belongsToUserHousehold =
      user.householdId === fromAccount.householdId && user.householdId === toAccount.householdId;

    const result = sameHousehold && belongsToUserHousehold;

    this.logger.debug(
      `Result for canUserTransferBetweenAccounts (userId: ${userId}, fromAccountId: ${fromAccountId}, toAccountId: ${toAccountId}): ${result}`,
    );
    return result;
  }

  async canUserUpdateCategoryBudget(userId: string, categoryBudgetId: string): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can update category budget ${categoryBudgetId}.`);

    const user = await this.usersService.findUserById(userId);
    const categoryBudget = await this.categoryBudgetsService.findCategoryBudgetById(categoryBudgetId);
    const result = user.householdId === categoryBudget.householdId;

    this.logger.debug(
      `Result for canUserUpdateCategoryBudget (userId: ${userId}, categoryBudgetId: ${categoryBudgetId}): ${result}`,
    );
    return result;
  }

  async canUserAccessHousehold(userId: string, householdId: string): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can access household ${householdId}.`);

    const user = await this.usersService.findUserById(userId);
    const result = user.householdId === householdId;

    this.logger.debug(`Result for canUserAccessHousehold (userId: ${userId}, householdId: ${householdId}): ${result}`);
    return result;
  }

  async canUserInviteToHousehold(userId: string, householdId: string): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can invite to household ${householdId}.`);

    const user = await this.usersService.findUserById(userId);
    const result = user.householdId === householdId;

    this.logger.debug(
      `Result for canUserInviteToHousehold (userId: ${userId}, householdId: ${householdId}): ${result}`,
    );
    return result;
  }

  async canUserModifyCategory(userId: string, categoryId: string): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can modify category ${categoryId}.`);

    const user = await this.usersService.findUserById(userId);
    const category = await this.categoriesService.findCategoryById(categoryId);
    const result = user.householdId === category.householdId;

    this.logger.debug(`Result for canUserModifyCategory (userId: ${userId}, categoryId: ${categoryId}): ${result}`);
    return result;
  }
}
