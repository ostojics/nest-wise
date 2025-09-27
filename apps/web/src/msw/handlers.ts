import {userHandlers} from '../modules/users/mocks/handlers';
import {householdHandlers} from '../modules/households/mocks/handlers';
import {accountHandlers} from '../modules/accounts/mocks/handlers';
import {categoryHandlers} from '../modules/categories/mocks/handlers';
import {transactionHandlers} from '../modules/transactions/mocks/handlers';
import {categoryBudgetHandlers} from '../modules/category-budgets/mocks/handlers';

export const handlers = [
  ...userHandlers,
  ...householdHandlers,
  ...accountHandlers,
  ...categoryHandlers,
  ...transactionHandlers,
  ...categoryBudgetHandlers,
];
