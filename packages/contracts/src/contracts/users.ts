import {HouseholdContract} from './households';

export interface UserContract {
  id: string;
  householdId: string;
  household: HouseholdContract;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
