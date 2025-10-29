import {z} from 'zod';
import {PaginationMetaContract} from './interfaces/paginated-response';

export enum ScheduledTransactionFrequencyType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum ScheduledTransactionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
}

export interface ScheduledTransactionRuleContract {
  id: string;
  householdId: string;
  userId: string; // User who created this rule
  accountId: string;
  categoryId: string | null;
  type: 'income' | 'expense';
  amount: number;
  description: string | null;
  frequencyType: ScheduledTransactionFrequencyType;
  dayOfWeek: number | null; // 0-6 (Sunday-Saturday), required for weekly
  dayOfMonth: number | null; // 1-31, required for monthly
  startDate: string;
  status: ScheduledTransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetScheduledTransactionsResponseContract {
  data: ScheduledTransactionRuleContract[];
  meta: PaginationMetaContract;
}

export const ScheduledTransactionFrequencyTypeEnum = z.enum(['weekly', 'monthly']);
export const ScheduledTransactionStatusEnum = z.enum(['active', 'paused']);
export const TransactionTypeForScheduledEnum = z.enum(['income', 'expense']);

export const createScheduledTransactionRuleSchema = z
  .object({
    accountId: z.string().uuid(),
    categoryId: z.string().uuid().nullable(),
    type: TransactionTypeForScheduledEnum,
    amount: z.number().positive(),
    description: z.string().max(256).nullable(),
    frequencyType: ScheduledTransactionFrequencyTypeEnum,
    dayOfWeek: z.number().int().min(0).max(6).nullable(),
    dayOfMonth: z.number().int().min(1).max(31).nullable(),
    startDate: z.string().date(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.frequencyType === 'weekly') {
        return data.dayOfWeek !== null;
      }
      return true;
    },
    {
      message: 'dayOfWeek is required when frequencyType is weekly',
      path: ['dayOfWeek'],
    },
  )
  .refine(
    (data) => {
      if (data.frequencyType === 'monthly') {
        return data.dayOfMonth !== null;
      }
      return true;
    },
    {
      message: 'dayOfMonth is required when frequencyType is monthly',
      path: ['dayOfMonth'],
    },
  )
  .refine(
    (data) => {
      if (data.type === 'income') {
        return data.categoryId === null;
      }
      return true;
    },
    {
      message: 'categoryId must be null for income transactions',
      path: ['categoryId'],
    },
  );

export const createScheduledTransactionRuleHouseholdSchema = z
  .object({
    accountId: z.string().uuid(),
    categoryId: z.string().uuid().nullable(),
    type: TransactionTypeForScheduledEnum,
    amount: z.number().positive(),
    description: z.string().min(1).max(256),
    frequencyType: ScheduledTransactionFrequencyTypeEnum,
    dayOfWeek: z.number().int().min(0).max(6).nullable(),
    dayOfMonth: z.number().int().min(1).max(31).nullable(),
    startDate: z.string().datetime('Početak datuma u mora biti u formatu ISO 8601'),
  })
  .strict()
  .refine(
    (data) => {
      if (data.frequencyType === 'weekly') {
        return data.dayOfWeek !== null;
      }
      return true;
    },
    {
      message: 'dayOfWeek is required when frequencyType is weekly',
      path: ['dayOfWeek'],
    },
  )
  .refine(
    (data) => {
      if (data.frequencyType === 'monthly') {
        return data.dayOfMonth !== null;
      }
      return true;
    },
    {
      message: 'dayOfMonth is required when frequencyType is monthly',
      path: ['dayOfMonth'],
    },
  )
  .refine(
    (data) => {
      if (data.type === 'income') {
        return data.categoryId === null;
      }
      return true;
    },
    {
      message: 'categoryId must be null for income transactions',
      path: ['categoryId'],
    },
  )
  .refine(
    (data) => {
      if (data.type === 'expense') {
        return data.categoryId !== null;
      }
      return true;
    },
    {
      message: 'categoryId is required for expense transactions',
      path: ['categoryId'],
    },
  );

export const updateScheduledTransactionRuleSchema = z
  .object({
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().nullable().optional(),
    type: TransactionTypeForScheduledEnum.optional(),
    amount: z.number().positive().optional(),
    description: z.string().max(256).nullable().optional(),
    frequencyType: ScheduledTransactionFrequencyTypeEnum.optional(),
    dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
    dayOfMonth: z.number().int().min(1).max(31).nullable().optional(),
    startDate: z.string().date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.frequencyType === 'weekly' && data.dayOfWeek === undefined) {
        return false;
      }
      if (data.frequencyType === 'monthly' && data.dayOfMonth === undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'dayOfWeek/dayOfMonth required when changing frequencyType',
    },
  )
  .refine(
    (data) => {
      if (data.type === 'income') {
        return data.categoryId === null || data.categoryId === undefined;
      }
      return true;
    },
    {
      message: 'categoryId must be null for income transactions',
      path: ['categoryId'],
    },
  );

export const getScheduledTransactionsQuerySchema = z
  .object({
    status: ScheduledTransactionStatusEnum.optional(),
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(15),
    sort: z.string().optional(),
  })
  .strict();

export const getScheduledTransactionsQueryHouseholdSchema = z
  .object({
    status: ScheduledTransactionStatusEnum.optional(),
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(15),
    sort: z.string().optional(),
  })
  .strict();

export type CreateScheduledTransactionRuleDTO = z.infer<typeof createScheduledTransactionRuleSchema>;
export type CreateScheduledTransactionRuleHouseholdDTO = z.infer<typeof createScheduledTransactionRuleHouseholdSchema>;
export type UpdateScheduledTransactionRuleDTO = z.infer<typeof updateScheduledTransactionRuleSchema>;
export type GetScheduledTransactionsQueryDTO = z.infer<typeof getScheduledTransactionsQuerySchema>;
export type GetScheduledTransactionsQueryHouseholdDTO = z.infer<typeof getScheduledTransactionsQueryHouseholdSchema>;
