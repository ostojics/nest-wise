import {
  GetAccountsSpendingQueryDTO,
  GetCategoryBudgetsQueryParams,
  GetPrivateTransactionsQueryDTO,
  GetTransactionsQueryDTO,
} from '@maya-vault/contracts';

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
    tag: () => ['private-transactions'],
    all: (search: GetPrivateTransactionsQueryDTO) => ['private-transactions', search],
  },
};
