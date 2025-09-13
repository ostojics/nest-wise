import {z} from 'zod';
import {userRegistrationSchema} from './users';
import {createHouseholdSchema} from './households';

export const loginSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;

export const setupSchema = z
  .object({
    user: userRegistrationSchema,
    household: createHouseholdSchema,
  })
  .strict();

export type SetupDTO = z.infer<typeof setupSchema>;
