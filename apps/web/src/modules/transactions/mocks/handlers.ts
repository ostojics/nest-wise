import {http, HttpResponse} from 'msw';
import {TransactionType} from '@nest-wise/contracts';
import type {TransactionContract, AccountContract} from '@nest-wise/contracts';
import {mockCategory1, mockCategory2} from '../../categories/mocks/handlers';

// Mock account data (reused from accounts module)
const mockAccount: AccountContract = {
  id: 'a-1',
  householdId: 'h-1',
  name: 'Checking Account',
  type: 'checking',
  initialBalance: 150000,
  currentBalance: 150000, // $1500.00
  ownerId: 'u-1',
  isActive: true,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

// Mock transaction data
const mockTransactions: TransactionContract[] = [
  {
    id: 't-1',
    householdId: 'h-1',
    accountId: 'a-1',
    categoryId: 'c-1',
    amount: 25000, // $250.00
    type: TransactionType.EXPENSE,
    description: 'Grocery shopping',
    transactionDate: new Date('2024-01-15T00:00:00.000Z').toISOString(),
    isReconciled: true,
    createdAt: new Date('2024-01-15T00:00:00.000Z'),
    updatedAt: new Date('2024-01-15T00:00:00.000Z'),
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
    transactionDate: new Date('2024-01-10T00:00:00.000Z').toISOString(),
    isReconciled: true,
    createdAt: new Date('2024-01-10T00:00:00.000Z'),
    updatedAt: new Date('2024-01-10T00:00:00.000Z'),
    account: mockAccount,
    category: mockCategory2,
  },
];

export const transactionHandlers = [
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

    return HttpResponse.json(
      {
        data: filteredTransactions,
        meta: {
          totalCount: filteredTransactions.length,
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
