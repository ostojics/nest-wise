import {UserContract} from '@maya-vault/contracts';
import httpClient from './http-client';

export const getUsers = () => {
  return httpClient.get('v1/users').json<UserContract[]>();
};
