import {LoginDTO} from '@maya-vault/validation';
import httpClient from './http-client';

export const login = (dto: LoginDTO) => {
  return httpClient.post('/v1/auth/login', {json: dto}).json();
};
