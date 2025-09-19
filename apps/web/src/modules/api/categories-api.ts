import httpClient from './http-client';
import {CategoryContract, CreateCategoryDTO} from '@nest-wise/contracts';

export const createCategory = async (category: CreateCategoryDTO) => {
  return await httpClient
    .post('v1/categories', {
      json: category,
    })
    .json<CategoryContract>();
};
