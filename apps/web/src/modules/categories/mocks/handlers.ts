import {http, HttpResponse} from 'msw';
import type {CategoryContract} from '@nest-wise/contracts';

// Mock category data
const mockCategory1: CategoryContract = {
  id: '550e8400-e29b-41d4-a716-446655440004',
  householdId: '550e8400-e29b-41d4-a716-446655440002',
  name: 'Groceries',
  description: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockCategory2: CategoryContract = {
  id: '550e8400-e29b-41d4-a716-446655440005',
  householdId: '550e8400-e29b-41d4-a716-446655440002',
  name: 'Utilities',
  description: null,
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
