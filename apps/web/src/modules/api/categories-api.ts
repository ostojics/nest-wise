import httpClient from './http-client';
import {CategoryContract, CreateCategoryDTO} from '@nest-wise/contracts';

export const createCategoryForHousehold = async (householdId: string, category: CreateCategoryDTO) => {
  return await httpClient
    .post(`v1/households/${householdId}/categories`, {
      json: category,
    })
    .json<CategoryContract>();
};
