# Architecture Overview

This document provides a high-level overview of the NestWise backend architecture after the domain architecture refactoring.

## Layered Architecture

The application follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│        Controllers, API Endpoints, Request/Response         │
│                   (HTTP/REST Interface)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│              Use Cases, Event Emitters                       │
│          (Business Operation Orchestration)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                             │
│         Entities, Domain Methods, Business Rules            │
│              (Core Business Logic)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                Infrastructure Layer                          │
│    Repositories, External Services, Database Access         │
│           (Technical Implementation)                         │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Presentation Layer

**Location:** `src/*/*.controller.ts`

**Responsibilities:**

- Handle HTTP requests/responses
- Validate input DTOs with Zod
- Call service methods
- Format responses

**Example:**

```typescript
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDTO) {
    return await this.transactionsService.createTransaction(dto);
  }
}
```

### 2. Application Layer

**Location:** `src/application/use-cases/`

**Responsibilities:**

- Orchestrate business operations
- Coordinate between domain and infrastructure
- Manage transactions
- Emit domain events

**Example:**

```typescript
@Injectable()
export class CreateTransactionUseCase implements IUseCase<CreateTransactionInput, Transaction> {
  async execute(input: CreateTransactionInput): Promise<Transaction> {
    return await this.dataSource.transaction(async () => {
      // Validate, create, update related entities
      // Emit domain events
      return transaction;
    });
  }
}
```

### 3. Domain Layer

**Location:** `src/*/*.entity.ts` + domain methods

**Responsibilities:**

- Define business entities
- Implement business rules
- Provide domain methods

**Example:**

```typescript
@Entity('accounts')
export class Account {
  // Domain methods
  hasSufficientFunds(amount: number): boolean {
    return Number(this.currentBalance) >= amount;
  }

  withdraw(amount: number): void {
    this.currentBalance = Number(this.currentBalance) - amount;
  }

  deposit(amount: number): void {
    this.currentBalance = Number(this.currentBalance) + amount;
  }
}
```

### 4. Infrastructure Layer

**Location:** `src/repositories/`, `src/infrastructure/`

**Responsibilities:**

- Implement repository interfaces
- Handle database operations
- Integrate with external services

**Example:**

```typescript
@Injectable()
export class TransactionsRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async create(data: CreateTransactionDTO): Promise<Transaction> {
    const transaction = this.repository.create(data);
    return await this.repository.save(transaction);
  }
}
```

## Event-Driven Communication

The application uses an event-driven architecture to decouple components:

```
┌──────────────┐         ┌──────────────┐
│  Use Case    │         │  Event       │
│              │ emits   │  Emitter     │
│  execute()   ├────────→│              │
└──────────────┘         └──────┬───────┘
                                │
                    ┌───────────┼───────────┐
                    ↓           ↓           ↓
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │Handler 1│ │Handler 2│ │Handler 3│
              │         │ │         │ │         │
              │Analytics│ │Budgets  │ │Audit    │
              └─────────┘ └─────────┘ └─────────┘
```

### Domain Events

Events are emitted when significant things happen:

- **Transaction Events**: `transaction.created`, `transaction.updated`, `transaction.deleted`
- **Account Events**: `account.balance.changed`, `account.funds.transferred`
- **Budget Events**: `category.budget.exceeded`, `category.budget.updated`

### Event Flow Example

```typescript
// In use case
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

// Future event handler (example)
@Injectable()
export class TransactionAnalyticsHandler {
  @OnEvent('transaction.created')
  async handleTransactionCreated(event: TransactionCreatedEvent) {
    // Update analytics
    await this.analyticsService.updateSpending(event);
  }
}
```

## Dependency Flow

```
Controllers → Services → Use Cases → Repositories
                   ↓
              Event Emitter
                   ↓
           Event Handlers (future)
```

### Dependency Rules

1. **Controllers** depend on **Services**
2. **Services** depend on **Use Cases** and **Repositories**
3. **Use Cases** depend on **Repositories** and **Domain Entities**
4. **Repositories** depend on **Infrastructure** (TypeORM)
5. **Domain Entities** have no dependencies (pure business logic)

## Module Organization

Each feature module follows this structure:

```
src/transactions/
├── transaction.entity.ts       # Domain entity
├── transactions.repository.ts  # Infrastructure
├── transactions.service.ts     # Service layer
├── transactions.controller.ts  # Presentation
├── transactions.module.ts      # Module definition
└── transactions.consumer.ts    # Background jobs (if needed)

src/application/use-cases/transactions/
├── create-transaction.use-case.ts
├── update-transaction.use-case.ts
└── delete-transaction.use-case.ts

src/domain/events/
└── transaction.events.ts
```

## Data Flow Example: Creating a Transaction

1. **HTTP Request** arrives at `TransactionsController`
2. **Controller** validates DTO and calls `TransactionsService.createTransaction()`
3. **Service** delegates to `CreateTransactionUseCase.execute()`
4. **Use Case** starts database transaction and:
   - Fetches account via `AccountsService`
   - Validates business rules (sufficient funds)
   - Creates transaction via `TransactionsRepository`
   - Updates account balance
   - Emits `transaction.created` event
   - Emits `account.balance.changed` event
5. **Use Case** returns created transaction
6. **Service** returns transaction to controller
7. **Controller** serializes and returns HTTP response
8. **Event Handlers** (if any) process emitted events asynchronously

## Testing Strategy

### Unit Tests

- **Use Cases**: Test with mocked repositories and services
- **Domain Methods**: Test business rules in isolation
- **Repositories**: Test with in-memory database

### Integration Tests

- **Controllers**: Test full request/response cycle
- **Event Handlers**: Test event processing

### E2E Tests

- Test complete user flows across multiple endpoints

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Testability**: Components can be tested in isolation
3. **Maintainability**: Changes are localized to specific layers
4. **Scalability**: Easy to add new features via events
5. **Flexibility**: Can swap implementations (e.g., different database)
6. **Clean Code**: Clear boundaries prevent spaghetti code

## Configuration

Event emitter is configured in `AppModule`:

```typescript
EventEmitterModule.forRoot({
  wildcard: true,
  delimiter: '.',
  maxListeners: 10,
  verboseMemoryLeak: true,
  ignoreErrors: false,
});
```

## Documentation

- [Event Catalog](../docs/EVENT_CATALOG.md) - All domain events
- [Use Case Patterns](../docs/USE_CASE_PATTERNS.md) - Use case best practices
- [Application Layer README](../src/application/README.md) - Application layer overview

## Future Enhancements

1. **Event Handlers**: Implement handlers for analytics, notifications, audit logging
2. **CQRS**: Separate read and write models for complex queries
3. **Event Sourcing**: Store events as source of truth (if needed)
4. **Saga Pattern**: Coordinate distributed transactions across services
5. **External Events**: Publish events to message queue (Redis, RabbitMQ) for microservices
