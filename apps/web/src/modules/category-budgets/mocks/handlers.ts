import {http, HttpResponse} from 'msw';
import {mockCategory1, mockCategory2} from '../../categories/mocks/handlers';

export const categoryBudgetHandlers = [
  // GET /v1/households/:id/category-budgets (for category budgets list)
  http.get('*/v1/households/:id/category-budgets', () => {
    return HttpResponse.json(
      [
        {
          id: '550e8400-e29b-41d4-a716-446655440008',
          householdId: '550e8400-e29b-41d4-a716-446655440002',
          categoryId: '550e8400-e29b-41d4-a716-446655440004',
          plannedAmount: 30000, // $300.00
          currentAmount: 25000, // $250.00 (Groceries spending)
          month: '2024-01',
          category: mockCategory1,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440009',
          householdId: '550e8400-e29b-41d4-a716-446655440002',
          categoryId: '550e8400-e29b-41d4-a716-446655440005',
          plannedAmount: 20000, // $200.00
          currentAmount: 15000, // $150.00 (Utilities spending)
          month: '2024-01',
          category: mockCategory2,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ],
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }),
];
