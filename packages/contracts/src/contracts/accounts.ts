import {z} from 'zod';

export const accountTypeEnum = z.enum(['checking', 'savings', 'credit_card', 'investment', 'cash', 'other'], {
  errorMap: () => ({
    message: 'Account type must be one of: checking, savings, credit_card, investment, cash, other',
  }),
});

export interface AccountContract {
  id: string;
  name: string;
  type: string;
  initialBalance: number;
  currentBalance: number;
  ownerId: string;
  householdId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createAccountSchema = z
  .object({
    name: z.string().min(1, 'Account name is required').max(255, 'Account name must be 255 characters or less'),
    type: accountTypeEnum,
    initialBalance: z.coerce.number().min(0, 'Balance must be 0 or greater'),
    ownerId: z.string().uuid('Owner ID must be a valid UUID'),
    householdId: z.string().uuid('Household ID must be a valid UUID'),
  })
  .strict();

export type CreateAccountDTO = z.infer<typeof createAccountSchema>;

// Household-scoped version without householdId (comes from path)
export const createAccountHouseholdScopedSchema = z
  .object({
    name: z.string().min(1, 'Account name is required').max(255, 'Account name must be 255 characters or less'),
    type: accountTypeEnum,
    initialBalance: z.coerce.number().min(0, 'Balance must be 0 or greater'),
    ownerId: z.string().uuid('Owner ID must be a valid UUID'),
  })
  .strict();

export type CreateAccountHouseholdScopedDTO = z.infer<typeof createAccountHouseholdScopedSchema>;

export const editAccountSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Account name is required')
      .max(255, 'Account name must be 255 characters or less')
      .optional(),
    type: accountTypeEnum.optional(),
    currentBalance: z.coerce.number().min(0, 'Balance must be 0 or greater').optional(),
  })
  .strict();

export type EditAccountDTO = z.infer<typeof editAccountSchema>;

export const transferFundsSchema = z
  .object({
    fromAccountId: z.string().uuid('Source account must be selected'),
    toAccountId: z.string().uuid('Destination account must be selected'),
    amount: z.coerce.number().min(1, 'Transfer amount must be at least 1'),
  })
  .strict()
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: 'fromAccountId and toAccountId must be different',
    path: ['toAccountId'],
  });

export type TransferFundsDTO = z.infer<typeof transferFundsSchema>;
