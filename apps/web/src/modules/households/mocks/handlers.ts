import {http, HttpResponse} from 'msw';
import type {HouseholdContract} from '@nest-wise/contracts';

// Mock household data
const mockHousehold: HouseholdContract = {
  id: 'h-1',
  name: 'Test Household',
  currencyCode: 'USD',
  monthlyBudget: 100000, // $1000.00
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const householdHandlers = [
  // GET /v1/households/:id
  http.get('*/v1/households/:id', () => {
    return HttpResponse.json(mockHousehold, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
];
