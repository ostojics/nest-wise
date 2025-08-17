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

export const inviteUserSchema = z.object({
  email: z.string().email(),
});

export type InviteUserDTO = z.infer<typeof inviteUserSchema>;
