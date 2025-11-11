import {
  BudgetAllocationWithCalculationsContract,
  CreateBudgetAllocationDTO,
  GetBudgetAllocationQueryParams,
  UpdateBudgetAllocationDTO,
} from '@nest-wise/contracts';
import httpClient from './http-client';

export const getBudgetAllocation = (
  householdId: string,
  params?: GetBudgetAllocationQueryParams,
): Promise<BudgetAllocationWithCalculationsContract> => {
  return httpClient
    .get(`v1/households/${householdId}/budget-allocation`, {
      searchParams: params,
    })
    .json();
};

export const createBudgetAllocation = (
  householdId: string,
  dto: CreateBudgetAllocationDTO,
): Promise<BudgetAllocationWithCalculationsContract> => {
  return httpClient
    .post(`v1/households/${householdId}/budget-allocation`, {
      json: dto,
    })
    .json();
};

export const updateBudgetAllocation = (
  householdId: string,
  id: string,
  dto: UpdateBudgetAllocationDTO,
): Promise<BudgetAllocationWithCalculationsContract> => {
  return httpClient
    .put(`v1/households/${householdId}/budget-allocation/${id}`, {
      json: dto,
    })
    .json();
};

export const deleteBudgetAllocation = (householdId: string, id: string): Promise<void> => {
  return httpClient.delete(`v1/households/${householdId}/budget-allocation/${id}`).json();
};
