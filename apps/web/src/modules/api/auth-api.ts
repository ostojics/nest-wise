import {LoginDTO, SetupDTO} from '@maya-vault/validation';
import httpClient from './http-client';
import {UserContract} from '@maya-vault/contracts';

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

export const me = () => {
  return httpClient.get('v1/auth/me').json<UserContract>();
};
