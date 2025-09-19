import {AccountContract, CategoryContract, HouseholdContract, UpdateHouseholdDTO} from '@nest-wise/contracts';
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

export const updateHousehold = (id: string, data: UpdateHouseholdDTO) => {
  return httpClient.put(`v1/households/${id}`, {json: data}).json<HouseholdContract>();
};
