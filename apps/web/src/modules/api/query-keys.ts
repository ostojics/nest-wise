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
  },
};
