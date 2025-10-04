import {
  AcceptInviteDTO,
  InviteUserDTO,
  UserContract,
  UpdateUsernameDTO,
  RequestEmailChangeDTO,
  ConfirmEmailChangeDTO,
} from '@nest-wise/contracts';
import httpClient from './http-client';

export const getHouseholdUsers = (householdId: string) => {
  return httpClient.get(`v1/households/${householdId}/users`).json<UserContract[]>();
};

export const inviteUserToHousehold = (householdId: string, dto: InviteUserDTO) => {
  return httpClient.post(`v1/households/${householdId}/invites`, {json: dto}).json();
};

export const acceptInvite = (dto: AcceptInviteDTO) => {
  return httpClient.post('v1/invites/accept', {json: dto}).json();
};

export const updateUsername = (dto: UpdateUsernameDTO) => {
  return httpClient.put('v1/users/username', {json: dto}).json();
};

export const requestEmailChange = (dto: RequestEmailChangeDTO) => {
  return httpClient.post('v1/users/email-change', {json: dto}).json();
};

export const confirmEmailChange = (dto: ConfirmEmailChangeDTO) => {
  return httpClient.post('v1/users/email-change/confirm', {json: dto}).json();
};
