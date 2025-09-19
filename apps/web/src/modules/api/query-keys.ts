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
    key: () => ['transactions'],
    all: (search: GetTransactionsQueryDTO) => ['transactions', search],
    allPages: (search: Partial<GetTransactionsQueryDTO>) => ['transactions-all-pages', search],
    netWorthTrend: () => ['net-worth-trend'],
    spendingByAccounts: (search: GetAccountsSpendingQueryDTO) => ['spending-by-accounts', search],
  },
  users: {
    all: () => ['users'],
  },
  categoryBudgets: {
    key: () => ['category-budgets'],
    all: (search: GetCategoryBudgetsQueryParams) => ['category-budgets', search],
  },
  savings: {
    trend: () => ['savings-trend'],
  },
  privateTransactions: {
    key: () => ['private-transactions'],
    all: (search: GetPrivateTransactionsQueryDTO) => ['private-transactions', search],
  },
};
