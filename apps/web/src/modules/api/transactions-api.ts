import {
  CreateTransactionDTO,
  CreateTransactionHouseholdDTO,
  CreateTransactionAiDTO,
  CreateTransactionAiHouseholdDTO,
  GetTransactionsQueryDTO,
  GetTransactionsQueryHouseholdDTO,
  GetAccountsSpendingQueryDTO,
  GetAccountsSpendingQueryHouseholdDTO,
} from '@nest-wise/contracts';
import httpClient from './http-client';
import {
  AccountSpendingPointContract,
  GetTransactionsResponseContract,
  NetWorthTrendPointContract,
} from '@nest-wise/contracts';

// Legacy endpoint - deprecated
export const getTransactions = async (query: GetTransactionsQueryDTO) => {
  return httpClient
    .get<GetTransactionsResponseContract>('v1/transactions', {
      searchParams: query,
    })
    .json();
};

// New household-scoped endpoint
export const getTransactionsForHousehold = async (householdId: string, query: GetTransactionsQueryHouseholdDTO) => {
  return httpClient
    .get<GetTransactionsResponseContract>(`v1/households/${householdId}/transactions`, {
      searchParams: query,
    })
    .json();
};

// Legacy endpoint - deprecated
export const createTransaction = async (transaction: CreateTransactionDTO) => {
  return await httpClient
    .post('v1/transactions', {
      json: transaction,
    })
    .json();
};

// New household-scoped endpoint
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

// Legacy endpoint - deprecated
export const createAiTransaction = async (transaction: CreateTransactionAiDTO) => {
  return await httpClient
    .post('v1/transactions/ai', {
      json: transaction,
    })
    .json();
};

// New household-scoped endpoint
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

// Legacy endpoint - deprecated
export const getNetWorthTrend = async () => {
  return await httpClient.get('v1/transactions/net-worth-trend').json<NetWorthTrendPointContract[]>();
};

// New household-scoped endpoint
export const getNetWorthTrendForHousehold = async (householdId: string) => {
  return await httpClient
    .get(`v1/households/${householdId}/transactions/net-worth-trend`)
    .json<NetWorthTrendPointContract[]>();
};

export const deleteTransaction = async (id: string) => {
  return httpClient.delete(`v1/transactions/${id}`).json();
};

// Legacy endpoint - deprecated
export const spendingByAccounts = async (dto: GetAccountsSpendingQueryDTO) => {
  return httpClient
    .get('v1/transactions/accounts-spending', {
      searchParams: dto,
    })
    .json<AccountSpendingPointContract[]>();
};

// New household-scoped endpoint
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
