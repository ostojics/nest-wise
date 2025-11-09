import {GetUserPreferencesResponseDTO, UpdateUserPreferencesDTO} from '@nest-wise/contracts';
import httpClient from './http-client';

export const getUserPreferences = () => {
  return httpClient.get('v1/user-preferences').json<GetUserPreferencesResponseDTO>();
};

export const updateUserPreferences = (dto: UpdateUserPreferencesDTO) => {
  return httpClient.put('v1/user-preferences', {json: dto}).json<GetUserPreferencesResponseDTO>();
};
