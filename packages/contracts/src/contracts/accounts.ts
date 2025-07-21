export interface AccountContract {
  id: string;
  name: string;
  type: string;
  initialBalance: number;
  currentBalance: number;
  ownerId: string;
  householdId: string;
  createdAt: Date;
  updatedAt: Date;
}
