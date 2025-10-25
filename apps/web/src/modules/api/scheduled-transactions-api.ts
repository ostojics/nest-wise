import {
  CreateScheduledTransactionRuleHouseholdDTO,
  UpdateScheduledTransactionRuleDTO,
  GetScheduledTransactionsQueryHouseholdDTO,
  GetScheduledTransactionsResponseContract,
  ScheduledTransactionRuleContract,
} from '@nest-wise/contracts';
import httpClient from './http-client';

// Household-scoped endpoints
export const getScheduledTransactionsForHousehold = async (
  householdId: string,
  query: GetScheduledTransactionsQueryHouseholdDTO,
) => {
  return httpClient
    .get<GetScheduledTransactionsResponseContract>(`v1/households/${householdId}/scheduled-transactions`, {
      searchParams: query,
    })
    .json();
};

export const getScheduledTransactionForHousehold = async (householdId: string, id: string) => {
  return httpClient
    .get<ScheduledTransactionRuleContract>(`v1/households/${householdId}/scheduled-transactions/${id}`)
    .json();
};

export const createScheduledTransactionForHousehold = async (
  householdId: string,
  transaction: CreateScheduledTransactionRuleHouseholdDTO,
) => {
  return await httpClient
    .post(`v1/households/${householdId}/scheduled-transactions`, {
      json: transaction,
    })
    .json<ScheduledTransactionRuleContract>();
};

export const updateScheduledTransactionForHousehold = async (
  householdId: string,
  id: string,
  dto: UpdateScheduledTransactionRuleDTO,
) => {
  return httpClient
    .patch<ScheduledTransactionRuleContract>(`v1/households/${householdId}/scheduled-transactions/${id}`, {
      json: dto,
    })
    .json();
};

export const pauseScheduledTransactionForHousehold = async (householdId: string, id: string) => {
  return httpClient
    .post<ScheduledTransactionRuleContract>(`v1/households/${householdId}/scheduled-transactions/${id}/pause`)
    .json();
};

export const resumeScheduledTransactionForHousehold = async (householdId: string, id: string) => {
  return httpClient
    .post<ScheduledTransactionRuleContract>(`v1/households/${householdId}/scheduled-transactions/${id}/resume`)
    .json();
};

export const deleteScheduledTransactionForHousehold = async (householdId: string, id: string) => {
  return httpClient.delete(`v1/households/${householdId}/scheduled-transactions/${id}`).json();
};
