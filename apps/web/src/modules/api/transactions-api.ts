import {
  CreateTransactionHouseholdDTO,
  CreateTransactionAiHouseholdDTO,
  GetTransactionsQueryHouseholdDTO,
  GetAccountsSpendingQueryHouseholdDTO,
} from '@nest-wise/contracts';
import httpClient from './http-client';
import {
  AccountSpendingPointContract,
  GetTransactionsResponseContract,
  NetWorthTrendPointContract,
} from '@nest-wise/contracts';

// Household-scoped endpoints
export const getTransactionsForHousehold = async (householdId: string, query: GetTransactionsQueryHouseholdDTO) => {
  return httpClient
    .get<GetTransactionsResponseContract>(`v1/households/${householdId}/transactions`, {
      searchParams: query,
    })
    .json();
};

export const createTransactionForHousehold = async (
  householdId: string,
  transaction: CreateTransactionHouseholdDTO,
) => {
  return await httpClient
    .post(`v1/households/${householdId}/transactions`, {
      json: transaction,
    })
    .json();
};

export const createAiTransactionForHousehold = async (
  householdId: string,
  transaction: CreateTransactionAiHouseholdDTO,
) => {
  return await httpClient
    .post(`v1/households/${householdId}/transactions/ai`, {
      json: transaction,
    })
    .json();
};

export const getNetWorthTrendForHousehold = async (householdId: string) => {
  return await httpClient
    .get(`v1/households/${householdId}/transactions/net-worth-trend`)
    .json<NetWorthTrendPointContract[]>();
};

export const spendingByAccountsForHousehold = async (
  householdId: string,
  dto: GetAccountsSpendingQueryHouseholdDTO,
) => {
  return httpClient
    .get(`v1/households/${householdId}/transactions/accounts-spending`, {
      searchParams: dto,
    })
    .json<AccountSpendingPointContract[]>();
};

// Item-level endpoints (keep these since they operate on individual transactions)
export const deleteTransaction = async (id: string) => {
  return httpClient.delete(`v1/transactions/${id}`).json();
};
