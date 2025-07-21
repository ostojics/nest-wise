import {CreateAccountDTO} from '@maya-vault/validation';
import httpClient from './http-client';

export const createAccount = (dto: CreateAccountDTO) => {
  return httpClient
    .post('v1/accounts', {
      json: dto,
    })
    .json();
};
