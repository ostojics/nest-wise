import {Injectable, ForbiddenException} from '@nestjs/common';
import {Request} from 'express';
import {AccountsService} from 'src/accounts/accounts.service';
import {CategoryBudgetsService} from 'src/category-budgets/category-budgets.service';
import {UsersService} from 'src/users/users.service';
import {I18nService} from 'src/lib/services/i18n.service';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly categoryBudgetsService: CategoryBudgetsService,
    private readonly i18nService: I18nService,
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

  async canUserInviteToHousehold(userId: string, householdId: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    return user.householdId === householdId;
  }

  // Enhanced methods that throw localized exceptions
  async canUserUpdateAccountOrThrow(userId: string, accountId: string, request?: Request): Promise<void> {
    const canUpdate = await this.canUserUpdateAccount(userId, accountId);
    if (!canUpdate) {
      const t = this.i18nService.getTranslator(request);
      throw new ForbiddenException(t('policy:cannotUpdateAccount'));
    }
  }

  async canUserTransferBetweenAccountsOrThrow(
    userId: string,
    fromAccountId: string,
    toAccountId: string,
    request?: Request,
  ): Promise<void> {
    const canTransfer = await this.canUserTransferBetweenAccounts(userId, fromAccountId, toAccountId);
    if (!canTransfer) {
      const t = this.i18nService.getTranslator(request);
      throw new ForbiddenException(t('policy:cannotTransferBetweenAccounts'));
    }
  }

  async canUserUpdateCategoryBudgetOrThrow(userId: string, categoryBudgetId: string, request?: Request): Promise<void> {
    const canUpdate = await this.canUserUpdateCategoryBudget(userId, categoryBudgetId);
    if (!canUpdate) {
      const t = this.i18nService.getTranslator(request);
      throw new ForbiddenException(t('policy:cannotUpdateCategoryBudget'));
    }
  }

  async canUserAccessHouseholdOrThrow(userId: string, householdId: string, request?: Request): Promise<void> {
    const canAccess = await this.canUserAccessHousehold(userId, householdId);
    if (!canAccess) {
      const t = this.i18nService.getTranslator(request);
      throw new ForbiddenException(t('policy:cannotAccessHousehold'));
    }
  }

  async canUserInviteToHouseholdOrThrow(userId: string, householdId: string, request?: Request): Promise<void> {
    const canInvite = await this.canUserInviteToHousehold(userId, householdId);
    if (!canInvite) {
      const t = this.i18nService.getTranslator(request);
      throw new ForbiddenException(t('policy:cannotInviteToHousehold'));
    }
  }
}
