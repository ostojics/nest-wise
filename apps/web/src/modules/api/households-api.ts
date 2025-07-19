import {HouseholdContract} from '@maya-vault/contracts';
import httpClient from './http-client';

export const getHouseholdById = (id: string) => {
  return httpClient.get(`v1/households/${id}`).json<HouseholdContract>();
};
