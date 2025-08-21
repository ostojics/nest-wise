import {AcceptInviteDTO, InviteUserDTO, UserContract} from '@maya-vault/contracts';
import httpClient from './http-client';

export const getUsers = () => {
  return httpClient.get('v1/users').json<UserContract[]>();
};

export const inviteUser = (dto: InviteUserDTO) => {
  return httpClient.post('v1/users/invites', {json: dto}).json();
};

export const acceptInvite = (dto: AcceptInviteDTO) => {
  return httpClient.post('v1/users/invites/accept', {json: dto}).json();
};
