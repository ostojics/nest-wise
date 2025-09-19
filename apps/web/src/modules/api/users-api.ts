import {AcceptInviteDTO, InviteUserDTO, UserContract} from '@nest-wise/contracts';
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
