import {
  CreateTransactionHouseholdDTO,
  CreateTransactionAiHouseholdDTO,
  GetTransactionsQueryHouseholdDTO,
  GetAccountsSpendingQueryHouseholdDTO,
  GetSpendingSummaryQueryHouseholdDTO,
  UpdateTransactionDTO,
  AiTransactionJobResponseContract,
  AiTransactionJobStatusContract,
  ConfirmAiTransactionSuggestionHouseholdDTO,
} from '@nest-wise/contracts';
import httpClient from './http-client';
import {
  AccountSpendingPointContract,
  GetTransactionsResponseContract,
  NetWorthTrendPointContract,
  SpendingTotalContract,
  CategorySpendingPointContract,
} from '@nest-wise/contracts';

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
  return httpClient
    .post(`v1/households/${householdId}/transactions`, {
      json: transaction,
    })
    .json();
};

export const requestAiTransactionSuggestion = async (
  householdId: string,
  transaction: CreateTransactionAiHouseholdDTO,
) => {
  return httpClient
    .post(`v1/households/${householdId}/transactions/ai`, {
      json: transaction,
    })
    .json<AiTransactionJobResponseContract>();
};

export const getAiTransactionSuggestionStatus = async (householdId: string, jobId: string) => {
  return httpClient.get(`v1/households/${householdId}/transactions/ai/${jobId}`).json<AiTransactionJobStatusContract>();
};

export const confirmAiTransactionSuggestion = async (
  householdId: string,
  confirmation: ConfirmAiTransactionSuggestionHouseholdDTO,
) => {
  return httpClient
    .post(`v1/households/${householdId}/transactions/ai/confirm`, {
      json: confirmation,
    })
    .json();
};

export const getNetWorthTrendForHousehold = async (householdId: string) => {
  return httpClient
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
