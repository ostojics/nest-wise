import {
  GetAccountsSpendingQueryDTO,
  GetAccountsSpendingQueryHouseholdDTO,
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
    spendingByAccounts: (search: GetAccountsSpendingQueryHouseholdDTO | GetAccountsSpendingQueryDTO) => [
      'spending-by-accounts',
      search,
    ],
  },
  users: {
    byHousehold: (householdId: string) => ['users', 'household', householdId],
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
