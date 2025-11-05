import {http, HttpResponse} from 'msw';
import {mockCategory1, mockCategory2, createdCategories} from '../../categories/mocks/handlers';
import type {CategoryBudgetWithCurrentAmountContract, EditCategoryBudgetDTO} from '@nest-wise/contracts';

// In-memory storage for category budgets
const mockBudgets: CategoryBudgetWithCurrentAmountContract[] = [
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
];

export const categoryBudgetHandlers = [
  // GET /v1/households/:id/category-budgets (for category budgets list)
  http.get('*/v1/households/:id/category-budgets', ({request}) => {
    const url = new URL(request.url);
    const month = url.searchParams.get('month') ?? '2024-01';

    // Auto-create budgets for any newly created categories
    const allCategories = [mockCategory1, mockCategory2, ...createdCategories];
    const existingCategoryIds = new Set(mockBudgets.map((b) => b.categoryId));

    allCategories.forEach((category) => {
      if (!existingCategoryIds.has(category.id)) {
        mockBudgets.push({
          id: `550e8400-e29b-41d4-a716-${Math.random().toString(36).substring(2, 14)}`,
          householdId: category.householdId,
          categoryId: category.id,
          plannedAmount: 0,
          currentAmount: 0,
          month,
          category: {name: category.name, description: category.description},
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        existingCategoryIds.add(category.id);
      }
    });

    return HttpResponse.json(mockBudgets, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // PATCH /v1/category-budgets/:id
  http.patch('*/v1/category-budgets/:id', async ({request, params}) => {
    const dto = (await request.json()) as EditCategoryBudgetDTO;
    const budgetId = params.id as string;
    const budget = mockBudgets.find((b) => b.id === budgetId);

    if (!budget) {
      return HttpResponse.json({message: 'Budget not found'}, {status: 404});
    }

    budget.plannedAmount = dto.plannedAmount;
    budget.updatedAt = new Date();

    return HttpResponse.json(budget, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
];
