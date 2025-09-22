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

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(25, 'Password must be 25 characters or less')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  );

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
    password: passwordSchema,
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

export const userRegistrationSchema = z
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
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Password confirmation is required'),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const userUpdateSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(50, 'Username must be 50 characters or less')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
      .optional(),
    email: z.string().email('Invalid email format').max(255, 'Email must be 255 characters or less').optional(),
  })
  .strict();

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirm_password: z.string().min(1, 'Password confirmation is required'),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const userResponseSchema = z
  .object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type UserRegistrationDTO = z.infer<typeof userRegistrationSchema>;
export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;
export type PasswordChangeDTO = z.infer<typeof passwordChangeSchema>;
export type UserResponseDTO = z.infer<typeof userResponseSchema>;
export interface CreateUserDTO extends Omit<UserRegistrationDTO, 'confirm_password'> {
  householdId: string;
}
