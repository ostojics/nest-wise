import {CreateTransactionDTO, CreateTransactionAiDTO, GetTransactionsQueryDTO} from '@maya-vault/validation';
import httpClient from './http-client';
import {
  AccountSpendingPointContract,
  GetAccountsSpendingQueryDTO,
  GetTransactionsResponseContract,
  NetWorthTrendPointContract,
} from '@maya-vault/contracts';

export const getTransactions = async (query: GetTransactionsQueryDTO) => {
  return httpClient
    .get<GetTransactionsResponseContract>('v1/transactions', {
      searchParams: query,
    })
    .json();
};

export const createTransaction = async (transaction: CreateTransactionDTO) => {
  return await httpClient
    .post('v1/transactions', {
      json: transaction,
    })
    .json();
};

export const createAiTransaction = async (transaction: CreateTransactionAiDTO) => {
  return await httpClient
    .post('v1/transactions/ai', {
      json: transaction,
    })
    .json();
};

export const getNetWorthTrend = async () => {
  return await httpClient.get('v1/transactions/net-worth-trend').json<NetWorthTrendPointContract[]>();
};

export const deleteTransaction = async (id: string) => {
  return httpClient.delete(`v1/transactions/${id}`).json();
};

export const spendingByAccounts = async (dto: GetAccountsSpendingQueryDTO) => {
  return httpClient
    .get('v1/transactions/accounts-spending', {
      searchParams: dto,
    })
    .json<AccountSpendingPointContract[]>();
};
