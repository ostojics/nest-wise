import {z} from 'zod';
import {userRegistrationSchema, passwordSchema} from './users';
import {createHouseholdSchema} from './households';

export const loginSchema = z
  .object({
    email: z
      .string({
        required_error: 'E‑pošta je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'E‑pošta je obavezna')
      .email('Neispravan format e‑pošte'),
    password: z
      .string({
        required_error: 'Lozinka je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(8, 'Lozinka mora imati najmanje 8 karaktera'),
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;

export const setupSchema = z
  .object({
    licenseKey: z
      .string({
        required_error: 'Licencni ključ je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Licencni ključ je obavezan'),
    user: userRegistrationSchema,
    household: createHouseholdSchema,
  })
  .strict();

export type SetupDTO = z.infer<typeof setupSchema>;

export const forgotPasswordSchema = z
  .object({
    email: z
      .string({
        required_error: 'E‑pošta je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'E‑pošta je obavezna')
      .email('Neispravan format e‑pošte')
      .max(255, 'E‑pošta može imati najviše 255 karaktera'),
  })
  .strict();

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z
      .string({
        required_error: 'Token je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Token je obavezan'),
    password: passwordSchema,
    confirm_password: z
      .string({
        required_error: 'Potvrda lozinke je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Potvrda lozinke je obavezna'),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: 'Lozinke se ne podudaraju',
    path: ['confirm_password'],
  });

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;

export const resetPasswordQueryParamsSchema = z.object({
  token: z.string({
    required_error: 'Token je obavezan',
    invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
  }),
});

export type ResetPasswordQueryParams = z.infer<typeof resetPasswordQueryParamsSchema>;

// Check Email schemas
export const checkEmailSchema = z.object({
  email: z.string().email('Unesite ispravnu email adresu'),
});

export type CheckEmailDTO = z.infer<typeof checkEmailSchema>;

export const checkEmailResponseSchema = z.object({
  available: z.boolean(),
});

export type CheckEmailResponseDTO = z.infer<typeof checkEmailResponseSchema>;
