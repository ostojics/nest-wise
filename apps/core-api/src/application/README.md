# Application Layer

This directory contains the application layer of the NestWise backend, which implements the use case pattern to encapsulate business operations and orchestrate domain logic.

## Overview

The application layer sits between the presentation layer (controllers) and the domain/infrastructure layers. It's responsible for:

- **Orchestrating business operations**: Coordinating interactions between domain entities, repositories, and services
- **Transaction management**: Ensuring data consistency across multiple operations
- **Event emission**: Publishing domain events when significant things happen
- **Business rule validation**: Enforcing business constraints before persisting changes

## Directory Structure

```
src/application/
└── use-cases/
    ├── base-use-case.ts           # Base interface for all use cases
    ├── index.ts                   # Barrel export
    ├── transactions/              # Transaction-related use cases
    │   ├── create-transaction.use-case.ts
    │   ├── create-transaction-for-household.use-case.ts
    │   ├── update-transaction.use-case.ts
    │   ├── delete-transaction.use-case.ts
    │   ├── create-ai-transaction-for-household.use-case.ts
    │   └── index.ts
    ├── accounts/                  # Account-related use cases
    │   ├── transfer-funds-for-household.use-case.ts
    │   └── index.ts
    └── category-budgets/          # Category budget use cases
        ├── get-category-budgets-for-household.use-case.ts
        └── index.ts
```

## Use Cases

### Transaction Use Cases

#### `CreateTransactionUseCase`

Creates a new transaction and updates the account balance.

**Responsibilities:**

- Validate account has sufficient funds (for expenses)
- Create transaction in database
- Update account balance
- Emit `transaction.created` and `account.balance.changed` events

#### `CreateTransactionForHouseholdUseCase`

Creates a transaction scoped to a household with additional validation.

**Responsibilities:**

- Verify account belongs to the specified household
- Validate account has sufficient funds (for expenses)
- Create transaction in database
- Update account balance
- Emit domain events

#### `UpdateTransactionUseCase`

Updates an existing transaction, handling account changes and balance adjustments.

**Responsibilities:**

- Handle changes to transaction amount, type, or account
- Recalculate balances when account changes
- Validate business rules (sufficient funds, household membership)
- Update transaction in database
- Emit `transaction.updated` event (future implementation)

#### `DeleteTransactionUseCase`

Deletes a transaction and reverses its effect on the account balance.

**Responsibilities:**

- Reverse the transaction's effect on account balance
- Delete transaction from database
- Emit `transaction.deleted` and `account.balance.changed` events

#### `CreateAiTransactionForHouseholdUseCase`

Creates a transaction using AI to categorize and parse transaction details.

**Responsibilities:**

- Call AI service to analyze transaction description
- Create or use existing category based on AI suggestion
- Create transaction with AI-generated details
- Update account balance
- Emit domain events with AI metadata

### Account Use Cases

#### `TransferFundsForHouseholdUseCase`

Transfers funds between two accounts within the same household.

**Responsibilities:**

- Validate both accounts belong to the household
- Check source account has sufficient funds
- Use domain methods to update account balances
- Emit `account.funds.transferred` and `account.balance.changed` events

### Category Budget Use Cases

#### `GetCategoryBudgetsForHouseholdUseCase`

Retrieves category budgets for a household with current spending amounts.

**Responsibilities:**

- Fetch categories and budgets for the household
- Create missing category budgets (with 0 planned amount)
- Calculate current spending from transactions
- Return budgets with current amounts

## Base Interface

All use cases implement the `IUseCase<TInput, TOutput>` interface:

```typescript
export interface IUseCase<TInput = void, TOutput = void> {
  execute(input: TInput): Promise<TOutput>;
}
```

This provides a consistent contract and makes use cases easy to test and mock.

## Key Features

### 1. Transaction Management

Use cases use TypeORM's DataSource to wrap operations in database transactions:

```typescript
return await this.dataSource.transaction(async () => {
  // All operations are atomic
  const transaction = await this.transactionsRepository.create(data);
  await this.updateBalance(accountId, amount);
  return transaction;
});
```

### 2. Domain Events

Use cases emit domain events to enable loose coupling:

```typescript
this.eventEmitter.emit(
  'transaction.created',
  new TransactionCreatedEvent(
    transaction.id,
    transaction.accountId,
    transaction.householdId,
    transaction.amount,
    transaction.type,
    transaction.categoryId,
  ),
);
```

### 3. Clear Input/Output Types

Each use case defines explicit input and output types:

```typescript
export interface CreateTransactionInput {
  transactionData: CreateTransactionDTO;
}

export class CreateTransactionUseCase implements IUseCase<CreateTransactionInput, Transaction> {
  async execute(input: CreateTransactionInput): Promise<Transaction> {
    // Implementation
  }
}
```

### 4. Dependency Injection

Use cases inject only what they need through constructor injection:

```typescript
constructor(
  @Inject(TRANSACTION_REPOSITORY)
  private readonly transactionsRepository: ITransactionRepository,
  private readonly accountsService: AccountsService,
  private readonly dataSource: DataSource,
  private readonly eventEmitter: EventEmitter2,
) {}
```

## Usage in Services

Services delegate complex operations to use cases:

```typescript
@Injectable()
export class TransactionsService {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  async createTransaction(transactionData: CreateTransactionDTO): Promise<Transaction> {
    return await this.createTransactionUseCase.execute({transactionData});
  }

  async updateTransaction(id: string, transactionData: UpdateTransactionDTO): Promise<Transaction> {
    return await this.updateTransactionUseCase.execute({id, transactionData});
  }
}
```

## Testing

Use cases are designed to be easily testable in isolation:

```typescript
describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockAccountsService: jest.Mocked<AccountsService>;
  let mockEventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(() => {
    // Setup mocks
  });

  it('should create transaction and emit events', async () => {
    // Test implementation
  });
});
```

## Documentation

For more detailed information, see:

- [Use Case Patterns](../../docs/USE_CASE_PATTERNS.md) - Detailed patterns and best practices
- [Event Catalog](../../docs/EVENT_CATALOG.md) - All domain events and their usage

## Benefits

1. **Separation of Concerns**: Business logic is isolated from presentation and infrastructure
2. **Testability**: Use cases can be tested independently with mocked dependencies
3. **Maintainability**: Changes to business logic are localized to specific use cases
4. **Reusability**: Use cases can be reused across different controllers or contexts
5. **Event-Driven**: Natural integration point for emitting domain events
6. **Transaction Safety**: Database transactions ensure data consistency

## Adding New Use Cases

To add a new use case:

1. Create a new file in the appropriate subdirectory (transactions, accounts, etc.)
2. Define the input and output types
3. Implement the `IUseCase` interface
4. Add dependency injection for required services/repositories
5. Implement the `execute` method with business logic
6. Emit relevant domain events
7. Export the use case from the subdirectory's `index.ts`
8. Register the use case as a provider in the module
9. Inject and use the use case in the service

Example:

```typescript
// create-something.use-case.ts
export interface CreateSomethingInput {
  data: CreateSomethingDTO;
}

@Injectable()
export class CreateSomethingUseCase implements IUseCase<CreateSomethingInput, Something> {
  constructor(
    @Inject(SOMETHING_REPOSITORY)
    private readonly repository: ISomethingRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: CreateSomethingInput): Promise<Something> {
    const {data} = input;

    // Business logic
    const something = await this.repository.create(data);

    // Emit event
    this.eventEmitter.emit('something.created', new SomethingCreatedEvent(...));

    return something;
  }
}
```

Then register in the module and use in the service as shown above.
