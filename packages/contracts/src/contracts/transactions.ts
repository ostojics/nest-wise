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
}
