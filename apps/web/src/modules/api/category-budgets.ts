import {CategoryBudgetContract, GetCategoryBudgetsQueryParams} from '@maya-vault/contracts';
import httpClient from './http-client';

export const getCategoryBudgets = (dto: GetCategoryBudgetsQueryParams) => {
  return httpClient
    .get('v1/category-budgets', {
      searchParams: dto,
    })
    .json<CategoryBudgetContract[]>();
};
