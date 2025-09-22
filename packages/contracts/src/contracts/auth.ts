import {z} from 'zod';
import {userRegistrationSchema, passwordSchema} from './users';
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

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(255, 'Email must be 255 characters or less'),
  })
  .strict();

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Password confirmation is required'),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;

export const resetPasswordQueryParamsSchema = z.object({
  token: z.string(),
});

export type ResetPasswordQueryParams = z.infer<typeof resetPasswordQueryParamsSchema>;
