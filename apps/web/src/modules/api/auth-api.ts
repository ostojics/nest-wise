import {LoginDTO, SetupDTO} from '@maya-vault/validation';
import httpClient from './http-client';

export const login = (dto: LoginDTO) => {
  return httpClient.post('v1/auth/login', {json: dto}).json();
};

export const setup = (data: SetupDTO) => {
  return httpClient
    .post('v1/auth/setup', {
      json: data,
    })
    .json();
};
