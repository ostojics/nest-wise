import {z} from 'zod';
import {PaginationMetaContract} from './interfaces/paginated-response';
import {AccountContract} from './accounts';
import {TransactionType} from './transactions';

export interface PrivateTransactionContract {
  id: string;
  householdId: string;
  accountId: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  transactionDate: Date;
  account?: AccountContract;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPrivateTransactionsResponseContract {
  data: PrivateTransactionContract[];
  meta: PaginationMetaContract;
}

export const createPrivateTransactionSchema = z
  .object({
    householdId: z.string().uuid(),
    accountId: z.string().uuid('Account must be selected'),
    amount: z.coerce
      .number()
      .min(0.01, 'Amount must be greater than 0')
      .max(10000000, 'Amount must be less than 10,000,000'),
    type: z.enum(['income', 'expense'], {
      errorMap: () => ({message: 'Type must be either income or expense'}),
    }),
    description: z.string().min(1, 'Description is required').max(2048),
    transactionDate: z.coerce.date(),
  })
  .strict();

export type CreatePrivateTransactionDTO = z.infer<typeof createPrivateTransactionSchema>;

export const privateTransactionSortFieldEnum = z.enum([
  'amount',
  '-amount',
  'type',
  '-type',
  'transactionDate',
  '-transactionDate',
  'createdAt',
  '-createdAt',
]);

export type TPrivateTransactionSortField = z.infer<typeof privateTransactionSortFieldEnum>;

export const getPrivateTransactionsQuerySchema = z
  .object({
    q: z.string().max(2048, 'Search query must be less than 2048 characters').optional(),
    householdId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
    type: z.enum(['income', 'expense']).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    sort: privateTransactionSortFieldEnum.optional().default('-transactionDate'),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(15),
  })
  .strict();

export type GetPrivateTransactionsQueryDTO = z.infer<typeof getPrivateTransactionsQuerySchema>;
