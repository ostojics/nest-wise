import {z} from 'zod';

export const accountTypeEnum = z.enum(['checking', 'savings', 'credit_card', 'investment', 'cash', 'other']);

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

// Household-scoped version without householdId (comes from path)
export const createAccountHouseholdScopedSchema = z
  .object({
    name: z.string().min(1).max(255),
    type: accountTypeEnum,
    initialBalance: z.coerce.number().min(0),
    ownerId: z.string().uuid(),
  })
  .strict();

export type CreateAccountHouseholdScopedDTO = z.infer<typeof createAccountHouseholdScopedSchema>;

export const editAccountSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    type: accountTypeEnum.optional(),
    currentBalance: z.coerce.number().min(0).optional(),
  })
  .strict();

export type EditAccountDTO = z.infer<typeof editAccountSchema>;

export const transferFundsSchema = z
  .object({
    fromAccountId: z.string().uuid(),
    toAccountId: z.string().uuid(),
    amount: z.coerce.number().min(1),
  })
  .strict()
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: 'accounts.validation.transferToSameAccount',
    path: ['toAccountId'],
  });

export type TransferFundsDTO = z.infer<typeof transferFundsSchema>;
