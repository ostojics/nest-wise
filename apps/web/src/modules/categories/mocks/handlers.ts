import {http, HttpResponse} from 'msw';
import type {CategoryContract} from '@nest-wise/contracts';

// Mock category data
const mockCategory1: CategoryContract = {
  id: 'c-1',
  householdId: 'h-1',
  name: 'Groceries',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockCategory2: CategoryContract = {
  id: 'c-2',
  householdId: 'h-1',
  name: 'Utilities',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const categoryHandlers = [
  // GET /v1/households/:id/categories
  http.get('*/v1/households/:id/categories', () => {
    return HttpResponse.json([mockCategory1, mockCategory2], {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
];

// Export mock data for use in other handlers
export {mockCategory1, mockCategory2};
