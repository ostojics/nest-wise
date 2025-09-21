import {z} from 'zod';
import {userRegistrationSchema} from './users';
import {createHouseholdSchema} from './households';

export const loginSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;

export const setupSchema = z
  .object({
    licenseKey: z.string().min(1, 'License key is required'),
    user: userRegistrationSchema,
    household: createHouseholdSchema,
  })
  .strict();

export type SetupDTO = z.infer<typeof setupSchema>;
