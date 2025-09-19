import {
  GetAccountsSpendingQueryDTO,
  GetCategoryBudgetsQueryParams,
  GetPrivateTransactionsQueryDTO,
  GetTransactionsQueryDTO,
} from '@nest-wise/contracts';

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
    allPagesKey: () => ['transactions-all-pages'],
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
    trendByHousehold: (householdId: string) => ['savings-trend', householdId],
  },
  privateTransactions: {
    key: () => ['private-transactions'],
    all: (search: GetPrivateTransactionsQueryDTO) => ['private-transactions', search],
  },
};
