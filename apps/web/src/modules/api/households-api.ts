import {AccountContract, CategoryContract, HouseholdContract, UpdateHouseholdDTO} from '@nest-wise/contracts';
import httpClient from './http-client';

export const getHouseholdById = (id: string) => {
  return httpClient.get(`v1/households/${id}`).json<HouseholdContract>();
};

export const getHouseholdAccounts = (householdId: string, opts?: {active?: boolean}) => {
  const searchParams = opts?.active !== undefined ? new URLSearchParams({active: String(opts.active)}) : undefined;
  return httpClient.get(`v1/households/${householdId}/accounts`, {searchParams}).json<AccountContract[]>();
};

export const getActiveHouseholdAccounts = (householdId: string) => {
  return getHouseholdAccounts(householdId, {active: true});
};

export const getHouseholdCategories = (householdId: string) => {
  return httpClient.get(`v1/households/${householdId}/categories`).json<CategoryContract[]>();
};

export const updateHousehold = (id: string, data: UpdateHouseholdDTO) => {
  return httpClient.put(`v1/households/${id}`, {json: data}).json<HouseholdContract>();
};
