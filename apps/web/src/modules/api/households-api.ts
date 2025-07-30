import {AccountContract, CategoryContract, HouseholdContract} from '@maya-vault/contracts';
import httpClient from './http-client';

export const getHouseholdById = (id: string) => {
  return httpClient.get(`v1/households/${id}`).json<HouseholdContract>();
};

export const getHouseholdAccounts = (householdId: string) => {
  return httpClient.get(`v1/households/${householdId}/accounts`).json<AccountContract[]>();
};

export const getHouseholdCategories = (householdId: string) => {
  return httpClient.get(`v1/households/${householdId}/categories`).json<CategoryContract[]>();
};
