import {CreatePrivateTransactionDTO} from '@maya-vault/contracts';
import httpClient from './http-client';

export const createPrivateTransaction = async (dto: CreatePrivateTransactionDTO) => {
  return httpClient
    .post('v1/private-transactions', {
      json: dto,
    })
    .json();
};
