import {
  GetAccountsSpendingQueryDTO,
  GetCategoryBudgetsQueryParams,
  GetPrivateTransactionsQueryDTO,
} from '@maya-vault/contracts';
import {GetTransactionsQueryDTO} from '@maya-vault/validation';

export const queryKeys = {
  me: () => ['me'],
  households: {
    single: (id: string) => ['households', id],
  },
  accounts: {
    all: () => ['accounts'],
  },
  categories: {
    all: () => ['categories'],
  },
  transactions: {
    all: (search: GetTransactionsQueryDTO) => ['transactions', search],
    netWorthTrend: () => ['net-worth-trend'],
    spendingByAccounts: (search: GetAccountsSpendingQueryDTO) => ['spending-by-accounts', search],
  },
  users: {
    all: () => ['users'],
  },
  categoryBudgets: {
    all: (search: GetCategoryBudgetsQueryParams) => ['category-budgets', search],
  },
  savings: {
    trend: () => ['savings-trend'],
  },
  privateTransactions: {
    all: (search: GetPrivateTransactionsQueryDTO) => ['private-transactions', search],
  },
};
