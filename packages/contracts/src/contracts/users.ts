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
  .string({
    required_error: 'Lozinka je obavezna',
    invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
  })
  .min(8, 'Lozinka mora imati najmanje 8 karaktera')
  .max(25, 'Lozinka može imati najviše 25 karaktera')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Lozinka mora sadržavati najmanje jedno malo slovo, jedno veliko slovo i jedan broj',
  );

export const inviteUserSchema = z.object({
  email: z
    .string({
      required_error: 'E‑pošta je obavezna',
      invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
    })
    .email('Neispravan format e‑pošte'),
});

export const acceptInviteSchema = z
  .object({
    username: z
      .string({
        required_error: 'Korisničko ime je obavezno',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Korisničko ime je obavezno')
      .max(50, 'Korisničko ime može imati najviše 50 karaktera')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Korisničko ime može sadržavati samo slova, brojeve, donje crte i crtice'),
    email: z
      .string({
        required_error: 'E‑pošta je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'E‑pošta je obavezna')
      .email('Neispravan format e‑pošte')
      .max(255, 'E‑pošta može imati najviše 255 karaktera'),
    password: passwordSchema,
    confirm_password: z
      .string({
        required_error: 'Potvrda lozinke je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Potvrda lozinke je obavezna'),
    token: z.string({
      required_error: 'Token je obavezan',
      invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
    }),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: 'Lozinke se ne podudaraju',
    path: ['confirm_password'],
  });

export const acceptInviteQueryParamsSchema = z.object({
  householdName: z.string({
    required_error: 'Naziv domaćinstva je obavezan',
    invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
  }),
  token: z.string({
    required_error: 'Token je obavezan',
    invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
  }),
  email: z
    .string({
      required_error: 'E‑pošta je obavezna',
      invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
    })
    .email('Neispravan format e‑pošte'),
});

export type InviteUserDTO = z.infer<typeof inviteUserSchema>;
export type AcceptInviteDTO = z.infer<typeof acceptInviteSchema>;
export type AcceptInviteQueryParams = z.infer<typeof acceptInviteQueryParamsSchema>;

export const userRegistrationSchema = z
  .object({
    username: z
      .string({
        required_error: 'Korisničko ime je obavezno',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Korisničko ime je obavezno')
      .max(50, 'Korisničko ime može imati najviše 50 karaktera')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Korisničko ime može sadržavati samo slova, brojeve, donje crte i crtice'),
    email: z
      .string({
        required_error: 'E‑pošta je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'E‑pošta je obavezna')
      .email('Neispravan format e‑pošte')
      .max(255, 'E‑pošta može imati najviše 255 karaktera'),
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

export const userUpdateSchema = z
  .object({
    username: z
      .string({
        required_error: 'Korisničko ime je obavezno',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Korisničko ime je obavezno')
      .max(50, 'Korisničko ime može imati najviše 50 karaktera')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Korisničko ime može sadržavati samo slova, brojeve, donje crte i crtice')
      .optional(),
    email: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .email('Neispravan format e‑pošte')
      .max(255, 'E‑pošta može imati najviše 255 karaktera')
      .optional(),
  })
  .strict();

export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string({
        required_error: 'Trenutna lozinka je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Trenutna lozinka je obavezna'),
    newPassword: passwordSchema,
    confirm_password: z
      .string({
        required_error: 'Potvrda lozinke je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Potvrda lozinke je obavezna'),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirm_password, {
    message: 'Lozinke se ne podudaraju',
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
