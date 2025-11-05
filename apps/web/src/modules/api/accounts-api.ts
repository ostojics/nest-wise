import {CreateAccountHouseholdScopedDTO} from '@nest-wise/contracts';
import httpClient from './http-client';
import {EditAccountDTO, TransferFundsDTO} from '@nest-wise/contracts';

// New household-scoped createAccount function
export const createAccountForHousehold = (householdId: string, dto: CreateAccountHouseholdScopedDTO) => {
  return httpClient
    .post(`v1/households/${householdId}/accounts`, {
      json: dto,
    })
    .json();
};

export const editAccount = (id: string, dto: EditAccountDTO) => {
  return httpClient
    .put(`v1/accounts/${id}`, {
      json: dto,
    })
    .json();
};

// New household-scoped transferFunds function
export const transferFundsForHousehold = (householdId: string, dto: TransferFundsDTO) => {
  return httpClient
    .post(`v1/households/${householdId}/accounts/transfer`, {
      json: dto,
    })
    .json();
};

export const activateAccount = (id: string) => {
  return httpClient.patch(`v1/accounts/${id}/activate`).json();
};

export const deactivateAccount = (id: string) => {
  return httpClient.patch(`v1/accounts/${id}/deactivate`).json();
};
