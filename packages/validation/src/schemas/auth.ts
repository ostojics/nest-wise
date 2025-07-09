import {z} from 'zod';

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
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be 128 characters or less')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      ),
    confirm_password: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username must be 50 characters or less')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  email: z.string().email('Invalid email format').max(255, 'Email must be 255 characters or less').optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(128, 'New password must be 128 characters or less')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password must contain at least one lowercase letter, one uppercase letter, and one number',
      ),
    confirm_password: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const loginSchema = z.object({
  email: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserRegistrationDTO = z.infer<typeof userRegistrationSchema>;
export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;
export type PasswordChangeDTO = z.infer<typeof passwordChangeSchema>;
export type UserResponseDTO = z.infer<typeof userResponseSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
