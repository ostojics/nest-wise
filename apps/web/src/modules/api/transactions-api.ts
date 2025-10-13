import {
  CreateTransactionHouseholdDTO,
  CreateTransactionAiHouseholdDTO,
  GetTransactionsQueryHouseholdDTO,
  GetAccountsSpendingQueryHouseholdDTO,
  GetSpendingSummaryQueryHouseholdDTO,
  UpdateTransactionDTO,
  AiTransactionJobResponseContract,
  AiTransactionJobStatusContract,
} from '@nest-wise/contracts';
import httpClient from './http-client';
import {
  AccountSpendingPointContract,
  GetTransactionsResponseContract,
  NetWorthTrendPointContract,
  SpendingTotalContract,
  CategorySpendingPointContract,
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
    .json<AiTransactionJobResponseContract>();
};

export const getAiTransactionJobStatus = async (householdId: string, jobId: string) => {
  return await httpClient
    .get(`v1/households/${householdId}/transactions/ai/${jobId}`)
    .json<AiTransactionJobStatusContract>();
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

export const getSpendingTotal = async (householdId: string, dto: GetSpendingSummaryQueryHouseholdDTO) => {
  return httpClient
    .get(`v1/households/${householdId}/transactions/spending-total`, {
      searchParams: dto,
    })
    .json<SpendingTotalContract>();
};

export const getCategoriesSpending = async (householdId: string, dto: GetSpendingSummaryQueryHouseholdDTO) => {
  return httpClient
    .get(`v1/households/${householdId}/transactions/categories-spending`, {
      searchParams: dto,
    })
    .json<CategorySpendingPointContract[]>();
};

// Item-level endpoints (keep these since they operate on individual transactions)
export const getTransaction = async (id: string) => {
  return httpClient.get(`v1/transactions/${id}`).json();
};

export const updateTransaction = async (id: string, dto: UpdateTransactionDTO) => {
  return httpClient
    .put(`v1/transactions/${id}`, {
      json: dto,
    })
    .json();
};

export const deleteTransaction = async (id: string) => {
  return httpClient.delete(`v1/transactions/${id}`).json();
};
