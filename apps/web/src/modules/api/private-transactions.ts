import {
  CreatePrivateTransactionDTO,
  GetPrivateTransactionsQueryDTO,
  GetPrivateTransactionsResponseContract,
} from '@nest-wise/contracts';
import httpClient from './http-client';

export const createPrivateTransaction = async (dto: CreatePrivateTransactionDTO) => {
  return httpClient
    .post('v1/users/me/private-transactions', {
      json: dto,
    })
    .json();
};

export const getPrivateTransactions = async (search: GetPrivateTransactionsQueryDTO) => {
  return httpClient
    .get('v1/users/me/private-transactions', {
      searchParams: search,
    })
    .json<GetPrivateTransactionsResponseContract>();
};

export const deletePrivateTransaction = async (id: string) => {
  return httpClient.delete(`v1/users/me/private-transactions/${id}`).json();
};
