import {z} from 'zod';

export const helpRequestSchema = z
  .object({
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
