# Use Case Patterns

This document describes the use case pattern and provides guidelines for implementing use cases in the NestWise application.

## Overview

Use cases represent the application layer in our architecture. They encapsulate single units of business logic and orchestrate interactions between domain entities, repositories, and other services.

## Architecture Layers

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (Controllers, API Endpoints)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Application Layer              │
│         (Use Cases)                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        Domain Layer                 │
│   (Entities, Domain Methods)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    Infrastructure Layer             │
│  (Repositories, External Services)  │
└─────────────────────────────────────┘
```

## Base Use Case Interface

All use cases implement the `IUseCase` interface:

```typescript
export interface IUseCase<TInput = void, TOutput = void> {
  execute(input: TInput): Promise<TOutput>;
}
```

## Use Case Structure

### 1. Input Type Definition

Define a clear input type that describes all parameters needed:

```typescript
export interface CreateTransactionInput {
  transactionData: CreateTransactionDTO;
}
```

### 2. Use Case Class

```typescript
@Injectable()
export class CreateTransactionUseCase implements IUseCase<CreateTransactionInput, Transaction> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
    private readonly accountsService: AccountsService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    const {transactionData} = input;

    return await this.dataSource.transaction(async () => {
      // 1. Validate business rules
      // 2. Execute domain logic
      // 3. Persist changes
      // 4. Emit domain events
      // 5. Return result
    });
  }
}
```

## Key Principles

### 1. Single Responsibility

Each use case should handle **one specific business operation**:

✅ Good:

- `CreateTransactionUseCase`
- `UpdateTransactionUseCase`
- `DeleteTransactionUseCase`

❌ Bad:

- `TransactionManagementUseCase` (too broad)
- `CreateOrUpdateTransactionUseCase` (multiple responsibilities)

### 2. Transaction Management

Use database transactions for operations that modify multiple entities:

```typescript
return await this.dataSource.transaction(async () => {
  // All operations within this block are atomic
  const transaction = await this.transactionsRepository.create(data);
  await this.updateBalance(accountId, amount);
  return transaction;
});
```

### 3. Event Emission

Emit domain events **after** successful persistence:

```typescript
// Create the entity
const transaction = await this.transactionsRepository.create(transactionData);

// Update related data
await this.updateBalance(...);

// Emit events
this.eventEmitter.emit(
  'transaction.created',
  new TransactionCreatedEvent(...)
);

this.eventEmitter.emit(
  'account.balance.changed',
  new AccountBalanceChangedEvent(...)
);
```

### 4. Error Handling

Let errors bubble up to the service layer. Use descriptive exceptions:

```typescript
if (account.householdId !== householdId) {
  throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
}

if (transactionData.type === 'expense' && Number(account.currentBalance) < transactionData.amount) {
  throw new BadRequestException('Nedovoljno sredstava za ovaj rashod');
}
```

### 5. Dependency Injection

Inject only what you need:

```typescript
constructor(
  // Repository abstractions (not concrete implementations)
  @Inject(TRANSACTION_REPOSITORY)
  private readonly transactionsRepository: ITransactionRepository,

  // Other services for orchestration
  private readonly accountsService: AccountsService,

  // Infrastructure
  private readonly dataSource: DataSource,
  private readonly eventEmitter: EventEmitter2,
) {}
```

## Use Case Examples

### Simple Use Case (Read Operation)

```typescript
export interface GetCategoryBudgetsForHouseholdInput {
  householdId: string;
  month: string;
}

@Injectable()
export class GetCategoryBudgetsForHouseholdUseCase
  implements IUseCase<GetCategoryBudgetsForHouseholdInput, CategoryBudgetWithCurrentAmountContract[]>
{
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(CATEGORY_BUDGET_REPOSITORY)
    private readonly categoryBudgetsRepository: ICategoryBudgetRepository,
    private readonly transactionsService: TransactionsService,
  ) {}

  async execute(input: GetCategoryBudgetsForHouseholdInput): Promise<CategoryBudgetWithCurrentAmountContract[]> {
    const {householdId, month} = input;

    // Fetch required data
    const [categories, budgets] = await Promise.all([
      this.categoriesService.findCategoriesByHouseholdId(householdId),
      this.categoryBudgetsRepository.findByHouseholdAndMonth(householdId, month),
    ]);

    // Business logic
    // ...

    return mapped;
  }
}
```

### Complex Use Case (Write Operation with Events)

```typescript
export interface TransferFundsForHouseholdInput {
  householdId: string;
  dto: TransferFundsDTO;
}

@Injectable()
export class TransferFundsForHouseholdUseCase
  implements IUseCase<TransferFundsForHouseholdInput, TransferFundsForHouseholdOutput>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: IAccountRepository,
    private readonly accountsService: AccountsService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: TransferFundsForHouseholdInput): Promise<TransferFundsForHouseholdOutput> {
    const {householdId, dto} = input;

    // Validation
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException('Source and destination must be different');
    }

    const fromAccount = await this.accountsService.findAccountById(dto.fromAccountId);
    const toAccount = await this.accountsService.findAccountById(dto.toAccountId);

    // Business rule validation
    if (!fromAccount.hasSufficientFunds(amount)) {
      throw new BadRequestException('Insufficient funds');
    }

    // Store old balances for events
    const fromOldBalance = Number(fromAccount.currentBalance);
    const toOldBalance = Number(toAccount.currentBalance);

    return await this.dataSource.transaction(async () => {
      // Use domain methods
      fromAccount.withdraw(amount);
      toAccount.deposit(amount);

      // Persist changes
      const updatedFrom = await this.accountsRepository.update(dto.fromAccountId, {
        currentBalance: fromAccount.currentBalance,
      });
      const updatedTo = await this.accountsRepository.update(dto.toAccountId, {
        currentBalance: toAccount.currentBalance,
      });

      // Emit events
      this.eventEmitter.emit('account.funds.transferred', new FundsTransferredEvent(...));
      this.eventEmitter.emit('account.balance.changed', new AccountBalanceChangedEvent(...));
      this.eventEmitter.emit('account.balance.changed', new AccountBalanceChangedEvent(...));

      return {fromAccount: updatedFrom, toAccount: updatedTo};
    });
  }
}
```

## Integration with Services

Services delegate to use cases for complex operations:

```typescript
@Injectable()
export class TransactionsService {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  async createTransaction(transactionData: CreateTransactionDTO): Promise<Transaction> {
    return await this.createTransactionUseCase.execute({transactionData});
  }

  async updateTransaction(id: string, transactionData: UpdateTransactionDTO): Promise<Transaction> {
    return await this.updateTransactionUseCase.execute({id, transactionData});
  }

  async deleteTransaction(id: string): Promise<void> {
    return await this.deleteTransactionUseCase.execute({id});
  }
}
```

## Module Registration

Register use cases as providers in the module:

```typescript
@Module({
  imports: [...],
  controllers: [...],
  providers: [
    TransactionsService,
    TransactionsRepository,
    {
      provide: TRANSACTION_REPOSITORY,
      useExisting: TransactionsRepository,
    },
    // Use cases
    CreateTransactionUseCase,
    CreateTransactionForHouseholdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    CreateAiTransactionForHouseholdUseCase,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
```

## Testing Use Cases

Use cases are easy to test in isolation:

```typescript
describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionsRepository: MockType<ITransactionRepository>;
  let accountsService: MockType<AccountsService>;
  let eventEmitter: MockType<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useFactory: mockTransactionRepository,
        },
        {
          provide: AccountsService,
          useFactory: mockAccountsService,
        },
        {
          provide: DataSource,
          useFactory: mockDataSource,
        },
        {
          provide: EventEmitter2,
          useFactory: mockEventEmitter,
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    transactionsRepository = module.get(TRANSACTION_REPOSITORY);
    accountsService = module.get(AccountsService);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should create a transaction and emit events', async () => {
    // Arrange
    const input = {...};
    accountsService.findAccountById.mockResolvedValue({...});
    transactionsRepository.create.mockResolvedValue({...});

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result).toBeDefined();
    expect(transactionsRepository.create).toHaveBeenCalledWith(expect.any(Object));
    expect(eventEmitter.emit).toHaveBeenCalledWith('transaction.created', expect.any(TransactionCreatedEvent));
    expect(eventEmitter.emit).toHaveBeenCalledWith('account.balance.changed', expect.any(AccountBalanceChangedEvent));
  });
});
```

## Benefits

1. **Single Responsibility**: Each use case has one clear purpose
2. **Testability**: Easy to test in isolation with mocked dependencies
3. **Reusability**: Can be reused across different controllers or contexts
4. **Maintainability**: Changes to business logic are localized
5. **Event-Driven**: Natural integration point for domain events
6. **Separation of Concerns**: Clear boundaries between layers

## Best Practices

1. **Name use cases after actions**: `CreateTransaction`, not `TransactionCreator`
2. **Keep use cases focused**: One business operation per use case
3. **Validate early**: Check business rules before modifying state
4. **Use transactions**: Wrap multi-entity operations in database transactions
5. **Emit events**: Notify other parts of the system about state changes
6. **Return domain entities**: Let controllers handle DTOs and serialization
7. **Document complex logic**: Add comments for non-obvious business rules
8. **Handle errors gracefully**: Use descriptive exceptions

## When to Create a Use Case

Create a use case when:

- The operation involves multiple steps or entities
- Business logic needs to be tested in isolation
- The operation emits domain events
- The operation requires transaction management
- You want to decouple orchestration from implementation

Don't create a use case for:

- Simple CRUD operations with no business logic
- Direct repository queries
- Pure data transformations
