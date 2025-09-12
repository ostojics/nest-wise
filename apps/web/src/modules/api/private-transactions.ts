import {
  CreatePrivateTransactionDTO,
  GetPrivateTransactionsQueryDTO,
  GetPrivateTransactionsResponseContract,
} from '@maya-vault/contracts';
import httpClient from './http-client';

export const createPrivateTransaction = async (dto: CreatePrivateTransactionDTO) => {
  return httpClient
    .post('v1/private-transactions', {
      json: dto,
    })
    .json();
};

export const getPrivateTransactions = async (search: GetPrivateTransactionsQueryDTO) => {
  return httpClient
    .get('v1/private-transactions', {
      searchParams: search,
    })
    .json<GetPrivateTransactionsResponseContract>();
};

export const deletePrivateTransaction = async (id: string) => {
  return httpClient.delete(`v1/private-transactions/${id}`).json();
};
