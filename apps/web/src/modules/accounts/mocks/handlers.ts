import {http, HttpResponse} from 'msw';
import type {AccountContract, CreateAccountHouseholdScopedDTO} from '@nest-wise/contracts';

// Mock account data
const mockAccount: AccountContract = {
  id: '550e8400-e29b-41d4-a716-446655440003',
  householdId: '550e8400-e29b-41d4-a716-446655440002',
  name: 'Checking Account',
  type: 'checking',
  initialBalance: 150000,
  currentBalance: 150000, // $1500.00
  ownerId: '550e8400-e29b-41d4-a716-446655440001',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

// Store created accounts for the session
const createdAccounts: AccountContract[] = [];
let accountIdCounter = 2;

export const accountHandlers = [
  // GET /v1/households/:id/accounts
  http.get('*/v1/households/:id/accounts', () => {
    // Always include the default mock account plus any created accounts
    const allAccounts = [mockAccount, ...createdAccounts];
    return HttpResponse.json(allAccounts, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // POST /v1/households/:id/accounts
  http.post('*/v1/households/:id/accounts', async ({request, params}) => {
    const body = (await request.json()) as CreateAccountHouseholdScopedDTO;
    const {id: householdId} = params;

    const newAccount: AccountContract = {
      id: `a-${accountIdCounter++}`,
      householdId: householdId as string,
      name: body.name,
      type: body.type,
      initialBalance: body.initialBalance,
      currentBalance: body.initialBalance,
      ownerId: body.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createdAccounts.push(newAccount);

    return HttpResponse.json(newAccount, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
];
