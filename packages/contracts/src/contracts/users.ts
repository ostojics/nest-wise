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
  .min(8)
  .max(25)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/);

export const inviteUserSchema = z.object({
  email: z.string().email(),
});

export const acceptInviteSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[a-zA-Z0-9_-]+$/),
    email: z.string().min(1).email().max(255),
    password: passwordSchema,
    confirm_password: z.string().min(1),
    token: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: 'users.validation.passwordsNotMatch',
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
      .min(1)
      .max(50)
      .regex(/^[a-zA-Z0-9_-]+$/),
    email: z.string().min(1).email().max(255),
    password: passwordSchema,
    confirm_password: z.string().min(1),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: 'users.validation.passwordsNotMatch',
    path: ['confirm_password'],
  });

export const userUpdateSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .optional(),
    email: z.string().email().max(255).optional(),
  })
  .strict();

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirm_password: z.string().min(1),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirm_password, {
    message: 'users.validation.passwordsNotMatch',
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
