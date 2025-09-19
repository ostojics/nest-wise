import {SavingsTrendPointContract} from '@nest-wise/contracts';
import httpClient from './http-client';

export const getSavingsTrend = async () => {
  return httpClient.get('v1/savings/trend').json<SavingsTrendPointContract[]>();
};

export const getSavingsTrendByHousehold = async (householdId: string) => {
  return httpClient.get(`v1/households/${householdId}/savings/trend`).json<SavingsTrendPointContract[]>();
};
