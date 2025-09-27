import {z} from 'zod';
import {userRegistrationSchema, passwordSchema} from './users';
import {createHouseholdSchema} from './households';

export const loginSchema = z
  .object({
    email: z.string().min(1).email(),
    password: z.string().min(8),
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;

export const setupSchema = z
  .object({
    licenseKey: z.string().min(1),
    user: userRegistrationSchema,
    household: createHouseholdSchema,
  })
  .strict();

export type SetupDTO = z.infer<typeof setupSchema>;

export const forgotPasswordSchema = z
  .object({
    email: z.string().min(1).email().max(255),
  })
  .strict();

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirm_password: z.string().min(1),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: 'auth.validation.passwordsNotMatch',
    path: ['confirm_password'],
  });

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;

export const resetPasswordQueryParamsSchema = z.object({
  token: z.string(),
});

export type ResetPasswordQueryParams = z.infer<typeof resetPasswordQueryParamsSchema>;
