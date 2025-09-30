import {http, HttpResponse} from 'msw';
import {mockCategory1, mockCategory2} from '../../categories/mocks/handlers';

export const categoryBudgetHandlers = [
  // GET /v1/households/:id/category-budgets (for category budgets list)
  http.get('*/v1/households/:id/category-budgets', () => {
    return HttpResponse.json(
      {
        data: [
          {
            id: 'cb-1',
            householdId: 'h-1',
            categoryId: 'c-1',
            budgetAmount: 30000, // $300.00
            month: '2024-01',
            category: mockCategory1,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
          },
          {
            id: 'cb-2',
            householdId: 'h-1',
            categoryId: 'c-2',
            budgetAmount: 20000, // $200.00
            month: '2024-01',
            category: mockCategory2,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
          },
        ],
        meta: {
          totalCount: 2,
          pageSize: 15,
          currentPage: 1,
          totalPages: 1,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }),
];
