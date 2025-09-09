import {z} from 'zod';
import {AccountContract} from './accounts';
import {CategoryContract} from './categories';
import {PaginationMetaContract} from './interfaces/paginated-response';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface TransactionContract {
  id: string;
  householdId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: Date;
  isReconciled: boolean;
  createdAt: Date;
  updatedAt: Date;
  account?: Pick<AccountContract, 'name' | 'variant'>;
  category?: Pick<CategoryContract, 'name' | 'type'>;
}

export interface GetTransactionsResponseContract {
  data: TransactionContract[];
  meta: PaginationMetaContract;
}

export interface NetWorthTrendPointContract {
  month: string;
  monthShort: string;
  amount: number | null;
  hasData: boolean;
}

export interface AccountSpendingPointContract {
  accountId: string;
  name: string;
  amount: number;
}

export const getAccountsSpendingQuerySchema = z
  .object({
    transactionDate_from: z.string().date().min(1),
    transactionDate_to: z.string().date().min(1),
  })
  .strict();

export type GetAccountsSpendingQueryDTO = z.infer<typeof getAccountsSpendingQuerySchema>;
