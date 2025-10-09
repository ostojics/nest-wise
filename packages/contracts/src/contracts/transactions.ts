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
  account?: AccountContract;
  category?: CategoryContract;
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

export interface SpendingTotalContract {
  total: number;
  count: number;
}

export interface CategorySpendingPointContract {
  categoryId: string | null;
  categoryName: string;
  amount: number;
}

export const getAccountsSpendingQuerySchema = z
  .object({
    transactionDate_from: z.string().date().min(1),
    transactionDate_to: z.string().date().min(1),
  })
  .strict();

// New household-scoped schema with simplified date parameters
export const getAccountsSpendingQueryHouseholdSchema = z
  .object({
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  })
  .strict();

export type GetAccountsSpendingQueryDTO = z.infer<typeof getAccountsSpendingQuerySchema>;
export type GetAccountsSpendingQueryHouseholdDTO = z.infer<typeof getAccountsSpendingQueryHouseholdSchema>;

// New household-scoped schema for spending aggregations - reusing existing query pattern
export const getSpendingSummaryQueryHouseholdSchema = z
  .object({
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  })
  .strict();

export type GetSpendingSummaryQueryHouseholdDTO = z.infer<typeof getSpendingSummaryQueryHouseholdSchema>;

export const TransactionTypeEnum = z.enum(['income', 'expense']);

export const TransactionSortFieldEnum = z.enum([
  'amount',
  '-amount',
  'type',
  '-type',
  'transactionDate',
  '-transactionDate',
  'createdAt',
  '-createdAt',
]);

export const createTransactionSchema = z
  .object({
    householdId: z
      .string({
        required_error: 'ID domaćinstva je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('ID domaćinstva mora biti važeći UUID'),
    accountId: z
      .string({
        required_error: 'Račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Račun mora biti izabran'),
    categoryId: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Kategorija mora biti izabrana')
      .nullable(),
    amount: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0.01, 'Iznos mora biti veći od 0')
      .max(10000000, 'Iznos mora biti manji od 10.000.000'),
    type: TransactionTypeEnum,
    description: z
      .string({
        required_error: 'Opis je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Opis je obavezan')
      .max(1000, 'Opis može imati najviše 1000 karaktera'),
    transactionDate: z.coerce.date({
      invalid_type_error: 'Neispravan datum',
    }),
    isReconciled: z
      .boolean({
        invalid_type_error: 'Neispravna vrednost (mora biti logička vrednost)',
      })
      .default(true),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.type === 'income' && val.categoryId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Prihodne transakcije ne smeju imati kategoriju',
      });
    }
    if (val.type === 'expense' && val.categoryId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Rashodne transakcije moraju imati kategoriju',
      });
    }
  });

// New household-scoped schema without householdId (provided in path)
export const createTransactionHouseholdSchema = z
  .object({
    accountId: z
      .string({
        required_error: 'Račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Račun mora biti izabran'),
    categoryId: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Kategorija mora biti izabrana')
      .nullable(),
    amount: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0.01, 'Iznos mora biti veći od 0')
      .max(10000000, 'Iznos mora biti manji od 10.000.000'),
    type: TransactionTypeEnum,
    description: z
      .string({
        required_error: 'Opis je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Opis je obavezan')
      .max(1000, 'Opis može imati najviše 1000 karaktera'),
    transactionDate: z.coerce.date({
      invalid_type_error: 'Neispravan datum',
    }),
    isReconciled: z
      .boolean({
        invalid_type_error: 'Neispravna vrednost (mora biti logička vrednost)',
      })
      .default(true),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.type === 'income' && val.categoryId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Prihodne transakcije ne smeju imati kategoriju',
      });
    }
    if (val.type === 'expense' && val.categoryId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Rashodne transakcije moraju imati kategoriju',
      });
    }
  });

export const createTransactionAiSchema = z
  .object({
    householdId: z
      .string({
        required_error: 'ID domaćinstva je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('ID domaćinstva mora biti važeći UUID'),
    accountId: z
      .string({
        required_error: 'Račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Račun mora biti izabran'),
    description: z
      .string({
        required_error: 'Opis je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Opis je obavezan')
      .max(1000, 'Opis može imati najviše 1000 karaktera'),
  })
  .strict();

// New household-scoped schema without householdId (provided in path)
export const createTransactionAiHouseholdSchema = z
  .object({
    accountId: z
      .string({
        required_error: 'Račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Račun mora biti izabran'),
    description: z
      .string({
        required_error: 'Opis je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Opis je obavezan')
      .max(1000, 'Opis može imati najviše 1000 karaktera'),
    transactionDate: z.coerce
      .date({
        invalid_type_error: 'Neispravan datum',
      })
      .optional(),
  })
  .strict();

export const updateTransactionSchema = z
  .object({
    categoryId: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Kategorija mora biti izabrana')
      .nullable()
      .optional(),
    amount: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0.01, 'Iznos mora biti veći od 0')
      .optional(),
    type: TransactionTypeEnum.optional(),
    description: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .max(1000, 'Opis može imati najviše 1000 karaktera')
      .nullable()
      .optional(),
    transactionDate: z.coerce
      .date({
        invalid_type_error: 'Neispravan datum',
      })
      .optional(),
    isReconciled: z
      .boolean({
        invalid_type_error: 'Neispravna vrednost (mora biti logička vrednost)',
      })
      .optional(),
  })
  .strict();

export const getTransactionsQuerySchema = z
  .object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(15),
    sort: TransactionSortFieldEnum.optional(),
    householdId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    type: TransactionTypeEnum.optional(),
    transactionDate_from: z.string().date().optional(),
    transactionDate_to: z.string().date().optional(),
    q: z.string().optional(),
  })
  .strict();

// New household-scoped schema without householdId (provided in path) with simplified date parameters
export const getTransactionsQueryHouseholdSchema = z
  .object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(15),
    sort: TransactionSortFieldEnum.optional(),
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    type: TransactionTypeEnum.optional(),
    from: z.string().date().optional(),
    to: z.string().date().optional(),
    q: z.string().optional(),
  })
  .strict();

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type CreateTransactionHouseholdDTO = z.infer<typeof createTransactionHouseholdSchema>;
export type CreateTransactionAiDTO = z.infer<typeof createTransactionAiSchema>;
export type CreateTransactionAiHouseholdDTO = z.infer<typeof createTransactionAiHouseholdSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsQueryDTO = z.infer<typeof getTransactionsQuerySchema>;
export type GetTransactionsQueryHouseholdDTO = z.infer<typeof getTransactionsQueryHouseholdSchema>;
export type TransactionSortField = z.infer<typeof TransactionSortFieldEnum>;

// AI Transaction Job Status
export enum AiTransactionJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface AiTransactionJobResponseContract {
  jobId: string;
  status: AiTransactionJobStatus;
}

export interface AiTransactionJobStatusContract {
  jobId: string;
  status: AiTransactionJobStatus;
  transaction?: TransactionContract;
  error?: string;
}
