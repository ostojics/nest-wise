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
  transactionDate: string;
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
    accountId: z
      .string({
        required_error: 'Račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Račun mora biti izabran'),
    amount: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0.01, 'Iznos mora biti veći od 0')
      .max(10000000, 'Iznos mora biti manji od 10.000.000'),
    type: z.enum(['income', 'expense'], {
      errorMap: () => ({message: 'Tip mora biti prihod ili rashod'}),
    }),
    description: z
      .string({
        required_error: 'Opis je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Opis je obavezan')
      .max(2048, 'Opis može imati najviše 2048 karaktera'),
    transactionDate: z
      .string({
        invalid_type_error: 'Neispravan datum',
      })
      .datetime({message: 'Datum mora biti u ISO 8601 formatu'}),
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
    q: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .max(2048, 'Pretraga može imati najviše 2048 karaktera')
      .optional(),
    accountId: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Račun mora biti izabran')
      .optional(),
    type: z.enum(['income', 'expense']).optional(),
    from: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .datetime({message: 'Datum mora biti u ISO 8601 formatu'})
      .optional(),
    to: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .datetime({message: 'Datum mora biti u ISO 8601 formatu'})
      .optional(),
    sort: privateTransactionSortFieldEnum.optional().default('-transactionDate'),
    page: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .int()
      .min(1)
      .default(1),
    pageSize: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .int()
      .min(1)
      .max(100)
      .default(15),
  })
  .strict();

export type GetPrivateTransactionsQueryDTO = z.infer<typeof getPrivateTransactionsQuerySchema>;
