import {CategoryBudgetContract, EditCategoryBudgetDTO, GetCategoryBudgetsQueryParams} from '@nest-wise/contracts';
import httpClient from './http-client';

export const getCategoryBudgets = (householdId: string, dto: GetCategoryBudgetsQueryParams) => {
  return httpClient
    .get(`v1/households/${householdId}/category-budgets`, {
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
