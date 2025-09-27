import {http, HttpResponse} from 'msw';
import type {AccountContract} from '@nest-wise/contracts';

// Mock account data
const mockAccount: AccountContract = {
  id: 'a-1',
  householdId: 'h-1',
  name: 'Checking Account',
  type: 'checking',
  initialBalance: 150000,
  currentBalance: 150000, // $1500.00
  ownerId: 'u-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const accountHandlers = [
  // GET /v1/households/:id/accounts
  http.get('*/v1/households/:id/accounts', () => {
    return HttpResponse.json([mockAccount]);
  }),
];
