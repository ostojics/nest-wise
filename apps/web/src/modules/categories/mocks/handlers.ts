import {http, HttpResponse} from 'msw';
import type {CategoryContract, CreateCategoryDTO} from '@nest-wise/contracts';

// Mock category data
const mockCategory1: CategoryContract = {
  id: '550e8400-e29b-41d4-a716-446655440004',
  householdId: '550e8400-e29b-41d4-a716-446655440002',
  name: 'Groceries',
  description: null,
  isDefault: false,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockCategory2: CategoryContract = {
  id: '550e8400-e29b-41d4-a716-446655440005',
  householdId: '550e8400-e29b-41d4-a716-446655440002',
  name: 'Utilities',
  description: null,
  isDefault: false,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

// In-memory storage for created categories
const createdCategories: CategoryContract[] = [];

export const categoryHandlers = [
  // GET /v1/households/:id/categories
  http.get('*/v1/households/:id/categories', () => {
    return HttpResponse.json([mockCategory1, mockCategory2, ...createdCategories], {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // POST /v1/households/:id/categories
  http.post('*/v1/households/:id/categories', async ({request, params}) => {
    const dto = (await request.json()) as CreateCategoryDTO;
    const newCategory: CategoryContract = {
      id: `550e8400-e29b-41d4-a716-${Math.random().toString(36).substring(2, 14)}`,
      householdId: params.id as string,
      name: dto.name,
      description: dto.description ?? null,
      isDefault: dto.isDefault ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    createdCategories.push(newCategory);
    return HttpResponse.json(newCategory, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
];

// Export mock data for use in other handlers
export {mockCategory1, mockCategory2, createdCategories};
