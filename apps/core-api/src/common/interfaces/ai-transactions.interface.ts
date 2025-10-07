import {CreateTransactionAiHouseholdDTO} from '@nest-wise/contracts';

export interface ProcessAiTransactionPayload {
  householdId: string;
  transactionData: CreateTransactionAiHouseholdDTO;
}
