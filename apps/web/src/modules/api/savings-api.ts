import {SavingsTrendPointContract} from '@nest-wise/contracts';
import httpClient from './http-client';

export const getSavingsTrendByHousehold = async (householdId: string) => {
  return httpClient.get(`v1/households/${householdId}/savings/trend`).json<SavingsTrendPointContract[]>();
};
