import {http, HttpResponse} from 'msw';
import {TransactionType} from '@nest-wise/contracts';
import type {
  UserContract,
  HouseholdContract,
  TransactionContract,
  AccountContract,
  CategoryContract,
} from '@nest-wise/contracts';

// Mock data that satisfies contracts used by the Plan page
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

const mockHousehold: HouseholdContract = {
  id: 'h-1',
  name: 'Test Household',
  currencyCode: 'USD',
  monthlyBudget: 100000, // $1000.00
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

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

const mockCategory1: CategoryContract = {
  id: 'c-1',
  householdId: 'h-1',
  name: 'Groceries',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockCategory2: CategoryContract = {
  id: 'c-2',
  householdId: 'h-1',
  name: 'Utilities',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockTransactions: TransactionContract[] = [
  {
    id: 't-1',
    householdId: 'h-1',
    accountId: 'a-1',
    categoryId: 'c-1',
    amount: 25000, // $250.00
    type: TransactionType.EXPENSE,
    description: 'Grocery shopping',
    transactionDate: new Date('2024-01-15'),
    isReconciled: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    account: mockAccount,
    category: mockCategory1,
  },
  {
    id: 't-2',
    householdId: 'h-1',
    accountId: 'a-1',
    categoryId: 'c-2',
    amount: 15000, // $150.00
    type: TransactionType.EXPENSE,
    description: 'Utility bill',
    transactionDate: new Date('2024-01-10'),
    isReconciled: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    account: mockAccount,
    category: mockCategory2,
  },
];

export const handlers = [
  // GET /v1/users/me
  http.get('*/v1/users/me', () => {
    return HttpResponse.json(mockUser);
  }),

  // GET /v1/households/:id
  http.get('*/v1/households/:id', () => {
    return HttpResponse.json(mockHousehold);
  }),

  // GET /v1/households/:id/transactions (with query parameters)
  http.get('*/v1/households/:id/transactions', ({request}) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    // Filter transactions by type if specified
    let filteredTransactions = mockTransactions;
    if (type === 'expense') {
      filteredTransactions = mockTransactions.filter((t) => t.type === TransactionType.EXPENSE);
    } else if (type === 'income') {
      filteredTransactions = mockTransactions.filter((t) => t.type === TransactionType.INCOME);
    }

    return HttpResponse.json({
      data: filteredTransactions,
      meta: {
        totalCount: filteredTransactions.length,
        pageSize: 15,
        currentPage: 1,
        totalPages: 1,
      },
    });
  }),

  // GET /v1/households/:id/categories
  http.get('*/v1/households/:id/categories', () => {
    return HttpResponse.json([mockCategory1, mockCategory2]);
  }),

  // GET /v1/households/:id/accounts
  http.get('*/v1/households/:id/accounts', () => {
    return HttpResponse.json([mockAccount]);
  }),

  // GET /v1/households/:id/category-budgets (for category budgets list)
  http.get('*/v1/households/:id/category-budgets', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'cb-1',
          householdId: 'h-1',
          categoryId: 'c-1',
          budgetAmount: 30000, // $300.00
          month: '2024-01',
          category: mockCategory1,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cb-2',
          householdId: 'h-1',
          categoryId: 'c-2',
          budgetAmount: 20000, // $200.00
          month: '2024-01',
          category: mockCategory2,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      meta: {
        totalCount: 2,
        pageSize: 15,
        currentPage: 1,
        totalPages: 1,
      },
    });
  }),
];
