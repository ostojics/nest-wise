import {CreateTransactionDTO} from '@maya-vault/validation';
import httpClient from './http-client';

export const createTransaction = async (transaction: CreateTransactionDTO) => {
  return await httpClient
    .post('v1/transactions', {
      json: transaction,
    })
    .json();
};
