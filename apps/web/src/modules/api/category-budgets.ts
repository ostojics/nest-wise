import {CategoryBudgetContract, EditCategoryBudgetDTO, GetCategoryBudgetsQueryParams} from '@maya-vault/contracts';
import httpClient from './http-client';

export const getCategoryBudgets = (dto: GetCategoryBudgetsQueryParams) => {
  return httpClient
    .get('v1/category-budgets', {
      searchParams: dto,
    })
    .json<CategoryBudgetContract[]>();
};

export const editCategoryBudget = (id: string, dto: EditCategoryBudgetDTO) => {
  return httpClient
    .patch(`v1/category-budgets/${id}`, {
      json: dto,
    })
    .json<CategoryBudgetContract>();
};
