import {LoginDTO, SetupDTO, ForgotPasswordDTO, ResetPasswordDTO, CheckEmailResponseDTO} from '@nest-wise/contracts';
import httpClient from './http-client';
import {UserContract} from '@nest-wise/contracts';

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

export const logout = () => {
  return httpClient.post('v1/auth/logout').json();
};

export const forgotPassword = (dto: ForgotPasswordDTO) => {
  return httpClient.post('v1/auth/forgot-password', {json: dto}).json();
};

export const resetPassword = (dto: ResetPasswordDTO) => {
  return httpClient.post('v1/auth/reset-password', {json: dto}).json();
};

export const checkEmailAvailability = (email: string): Promise<CheckEmailResponseDTO> => {
  return httpClient.post('v1/auth/check-email', {json: {email}}).json();
};
