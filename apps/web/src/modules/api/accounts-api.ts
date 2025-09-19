import {CreateAccountDTO} from '@nest-wise/contracts';
import httpClient from './http-client';
import {EditAccountDTO, TransferFundsDTO} from '@nest-wise/contracts';

export const createAccount = (dto: CreateAccountDTO) => {
  return httpClient
    .post('v1/accounts', {
      json: dto,
    })
    .json();
};

export const editAccount = (id: string, dto: EditAccountDTO) => {
  return httpClient
    .put(`v1/accounts/${id}`, {
      json: dto,
    })
    .json();
};

export const transferFunds = (dto: TransferFundsDTO) => {
  return httpClient
    .post('v1/accounts/transfer', {
      json: dto,
    })
    .json();
};
