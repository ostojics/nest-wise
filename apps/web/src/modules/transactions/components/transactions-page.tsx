import {TransactionsTable} from './transactions-table';
import {TransactionContract, TransactionType} from '@maya-vault/contracts';
import TransactionsTableActions from './transactions-table-actions';

const mockData: TransactionContract[] = [
  {
    id: '1',
    householdId: 'h1',
    accountId: 'a1',
    categoryId: 'c1',
    amount: 120.5,
    type: TransactionType.EXPENSE,
    description: 'Groceries at Market',
    transactionDate: new Date(),
    isReconciled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    account: {
      id: 'a1',
      name: 'Checking',
      type: 'checking',
      initialBalance: 1000,
      currentBalance: 879.5,
      ownerId: 'u1',
      householdId: 'h1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    category: {
      id: 'c1',
      name: 'Groceries',
      householdId: 'h1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: '2',
    householdId: 'h1',
    accountId: 'a1',
    categoryId: 'c2',
    amount: 2500,
    type: TransactionType.INCOME,
    description: 'Monthly Salary',
    transactionDate: new Date(),
    isReconciled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    account: {
      id: 'a1',
      name: 'Checking',
      type: 'checking',
      initialBalance: 1000,
      currentBalance: 3379.5,
      ownerId: 'u1',
      householdId: 'h1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    category: {
      id: 'c2',
      name: 'Income',
      householdId: 'h1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

const TransactionsPage = () => {
  return (
    <section className="p-4">
      <TransactionsTableActions />
      <TransactionsTable data={mockData} />
    </section>
  );
};

export default TransactionsPage;
