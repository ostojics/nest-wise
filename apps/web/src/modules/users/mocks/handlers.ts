import {http, HttpResponse} from 'msw';
import type {UserContract} from '@nest-wise/contracts';

// Mock user data
const mockUser: UserContract = {
  id: 'u-1',
  householdId: 'h-1',
  household: {
    id: 'h-1',
    name: 'Test Household',
    currencyCode: 'USD',
    monthlyBudget: 100000, // $1000.00
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  username: 'testuser',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const userHandlers = [
  // GET /v1/users/me
  http.get('*/v1/users/me', () => {
    return HttpResponse.json(mockUser);
  }),
];
