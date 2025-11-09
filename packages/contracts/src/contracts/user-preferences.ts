import {z} from 'zod';

export interface UserPreferenceContract {
  id: string;
  userId: string;
  automaticLogout: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getUserPreferencesResponseSchema = z
  .object({
    automaticLogout: z.boolean(),
  })
  .strict();

export const updateUserPreferencesSchema = z
  .object({
    automaticLogout: z.boolean().optional(),
  })
  .strict();

export type GetUserPreferencesResponseDTO = z.infer<typeof getUserPreferencesResponseSchema>;
export type UpdateUserPreferencesDTO = z.infer<typeof updateUserPreferencesSchema>;
