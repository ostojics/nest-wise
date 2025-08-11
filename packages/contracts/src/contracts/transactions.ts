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
  account?: AccountContract;
  category?: CategoryContract;
}

export interface GetTransactionsResponseContract {
  data: TransactionContract[];
  meta: PaginationMetaContract;
}
