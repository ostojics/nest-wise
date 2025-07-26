import {CreateCategoryDTO} from '@maya-vault/validation';
import httpClient from './http-client';
import {CategoryContract} from '@maya-vault/contracts';

export const createCategory = async (category: CreateCategoryDTO) => {
  return await httpClient
    .post('v1/categories', {
      json: category,
    })
    .json<CategoryContract>();
};
