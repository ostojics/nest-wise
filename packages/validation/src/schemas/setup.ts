import {z} from 'zod';
import {userRegistrationSchema} from './auth';
import {createHouseholdSchema} from './households';

export const setupSchema = z
  .object({
    user: userRegistrationSchema,
    household: createHouseholdSchema,
  })
  .strict();

export type SetupDTO = z.infer<typeof setupSchema>;
