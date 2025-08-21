import {HouseholdContract} from './households';
import {z} from 'zod';

export interface UserContract {
  id: string;
  householdId: string;
  household: HouseholdContract;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const inviteUserSchema = z.object({
  email: z.string({message: 'Email is required'}).email({message: 'Email must be valid'}),
});

export const acceptInviteSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(50, 'Username must be 50 characters or less')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(255, 'Email must be 255 characters or less'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be 128 characters or less')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      ),
    confirm_password: z.string().min(1, 'Password confirmation is required'),
    token: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const acceptInviteQueryParamsSchema = z.object({
  householdName: z.string(),
  token: z.string(),
  email: z.string().email(),
});

export type InviteUserDTO = z.infer<typeof inviteUserSchema>;
export type AcceptInviteDTO = z.infer<typeof acceptInviteSchema>;
export type AcceptInviteQueryParams = z.infer<typeof acceptInviteQueryParamsSchema>;
