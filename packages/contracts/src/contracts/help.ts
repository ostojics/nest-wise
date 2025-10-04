import {z} from 'zod';

export const helpRequestSchema = z
  .object({
    email: z
      .string({
        required_error: 'E‑pošta je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'E‑pošta je obavezna')
      .email('Neispravan format e‑pošte')
      .max(255, 'E‑pošta može imati najviše 255 karaktera'),
    message: z
      .string({
        required_error: 'Poruka je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(10, 'Poruka mora imati najmanje 10 karaktera')
      .max(2000, 'Poruka može imati najviše 2000 karaktera'),
  })
  .strict();

export type HelpRequestDTO = z.infer<typeof helpRequestSchema>;
