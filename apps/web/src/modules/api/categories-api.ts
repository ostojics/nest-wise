import httpClient from './http-client';
import {CategoryContract, CreateCategoryDTO, CreateCategoryHouseholdDTO} from '@nest-wise/contracts';

export const createCategory = async (category: CreateCategoryDTO) => {
  return await httpClient
    .post('v1/categories', {
      json: category,
    })
    .json<CategoryContract>();
};

export const createCategoryForHousehold = async (householdId: string, category: CreateCategoryHouseholdDTO) => {
  return await httpClient
    .post(`v1/households/${householdId}/categories`, {
      json: category,
    })
    .json<CategoryContract>();
};
