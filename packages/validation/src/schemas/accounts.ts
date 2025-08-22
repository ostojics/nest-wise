import {z} from 'zod';

export const createAccountSchema = z
  .object({
    name: z.string().min(1, 'Account name is required').max(255, 'Account name must be 255 characters or less'),
    type: z.enum(['checking', 'savings', 'credit_card', 'investment', 'cash', 'other'], {
      errorMap: () => ({
        message: 'Account type must be one of: checking, savings, credit_card, investment, cash, other',
      }),
    }),
    initialBalance: z.coerce.number().positive().min(10, 'Initial balance must be 10 or greater'),
    ownerId: z.string().uuid('Owner ID must be a valid UUID'),
    householdId: z.string().uuid('Household ID must be a valid UUID'),
  })
  .strict();

export const updateAccountSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Account name is required')
      .max(255, 'Account name must be 255 characters or less')
      .optional(),
    type: z
      .enum(['checking', 'savings', 'credit_card', 'investment', 'cash'], {
        errorMap: () => ({message: 'Account type must be one of: checking, savings, credit_card, investment, cash'}),
      })
      .optional(),
    initialBalance: z.number().min(0, 'Initial balance must be 0 or greater').optional(),
    currentBalance: z.number().optional(),
  })
  .strict();

export const accountResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    initialBalance: z.number(),
    currentBalance: z.number(),
    ownerId: z.string().uuid(),
    householdId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type CreateAccountDTO = z.infer<typeof createAccountSchema>;
export type UpdateAccountDTO = z.infer<typeof updateAccountSchema>;
export type AccountResponseDTO = z.infer<typeof accountResponseSchema>;
