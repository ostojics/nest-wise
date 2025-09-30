import httpClient from './http-client';
import {CategoryContract, CreateCategoryDTO, UpdateCategoryDTO} from '@nest-wise/contracts';

export const createCategoryForHousehold = async (householdId: string, category: CreateCategoryDTO) => {
  return await httpClient
    .post(`v1/households/${householdId}/categories`, {
      json: category,
    })
    .json<CategoryContract>();
};

export const updateCategory = async (id: string, dto: UpdateCategoryDTO) => {
  return await httpClient
    .put(`v1/categories/${id}`, {
      json: dto,
    })
    .json<CategoryContract>();
};
