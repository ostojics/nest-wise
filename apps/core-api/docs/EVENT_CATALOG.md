# Event Catalog

This document describes all domain events in the NestWise application. Events are emitted when significant things happen in the domain and enable loose coupling between different parts of the system.

## Event Categories

### Transaction Events

#### `transaction.created`

Emitted when a new transaction is created.

**Event Class:** `TransactionCreatedEvent`

**Payload:**

- `transactionId`: string - Unique identifier of the transaction
- `accountId`: string - ID of the account the transaction belongs to
- `householdId`: string - ID of the household
- `amount`: number - Transaction amount
- `type`: TransactionType - Type of transaction (income/expense)
- `categoryId`: string | null - Category ID (null for income transactions)
- `occurredOn`: Date - Timestamp when event was created

**Emitted By:**

- `CreateTransactionUseCase`
- `CreateTransactionForHouseholdUseCase`
- `CreateAiTransactionForHouseholdUseCase`

**Use Cases:**

- Audit logging
- Analytics and reporting
- Budget tracking
- Category spending calculations

---

#### `transaction.updated`

Emitted when an existing transaction is updated.

**Event Class:** `TransactionUpdatedEvent`

**Payload:**

- `transactionId`: string
- `accountId`: string
- `householdId`: string
- `oldAmount`: number
- `newAmount`: number
- `oldType`: TransactionType
- `newType`: TransactionType
- `oldAccountId`: string
- `newAccountId`: string
- `oldCategoryId`: string | null
- `newCategoryId`: string | null
- `occurredOn`: Date

**Emitted By:**

- `UpdateTransactionUseCase`

**Use Cases:**

- Audit trail
- Recalculating budgets
- Updating analytics
- Account balance adjustments

---

#### `transaction.deleted`

Emitted when a transaction is deleted.

**Event Class:** `TransactionDeletedEvent`

**Payload:**

- `transactionId`: string
- `accountId`: string
- `householdId`: string
- `amount`: number
- `type`: TransactionType
- `categoryId`: string | null
- `occurredOn`: Date

**Emitted By:**

- `DeleteTransactionUseCase`

**Use Cases:**

- Audit logging
- Budget recalculation
- Analytics cleanup
- Balance reconciliation

---

### Account Events

#### `account.balance.changed`

Emitted when an account's balance changes.

**Event Class:** `AccountBalanceChangedEvent`

**Payload:**

- `accountId`: string
- `householdId`: string
- `oldBalance`: number
- `newBalance`: number
- `reason`: 'transaction' | 'transfer' | 'adjustment'
- `metadata`: Record<string, unknown> - Additional context (e.g., transactionId, transferDetails)
- `occurredOn`: Date

**Emitted By:**

- `CreateTransactionUseCase`
- `CreateTransactionForHouseholdUseCase`
- `CreateAiTransactionForHouseholdUseCase`
- `UpdateTransactionUseCase`
- `DeleteTransactionUseCase`
- `TransferFundsForHouseholdUseCase`

**Use Cases:**

- Real-time balance updates
- Net worth calculations
- Balance change notifications
- Spending trends
- Low balance alerts

---

#### `account.funds.transferred`

Emitted when funds are transferred between accounts.

**Event Class:** `FundsTransferredEvent`

**Payload:**

- `fromAccountId`: string
- `toAccountId`: string
- `householdId`: string
- `amount`: number
- `occurredOn`: Date

**Emitted By:**

- `TransferFundsForHouseholdUseCase`

**Use Cases:**

- Transfer history
- Audit logging
- Analytics
- Notification to users

---

### Category Budget Events

#### `category.budget.exceeded`

Emitted when spending exceeds the planned budget for a category.

**Event Class:** `CategoryBudgetExceededEvent`

**Payload:**

- `categoryId`: string
- `householdId`: string
- `month`: string
- `plannedAmount`: number
- `currentAmount`: number
- `exceedAmount`: number
- `occurredOn`: Date

**Emitted By:**

- Potential future event handlers listening to transaction events

**Use Cases:**

- Budget alerts
- Notifications
- Financial insights
- Budget compliance reports

---

#### `category.budget.updated`

Emitted when a category budget is updated.

**Event Class:** `CategoryBudgetUpdatedEvent`

**Payload:**

- `categoryBudgetId`: string
- `categoryId`: string
- `householdId`: string
- `month`: string
- `oldPlannedAmount`: number
- `newPlannedAmount`: number
- `occurredOn`: Date

**Emitted By:**

- Potential future use case for updating category budgets

**Use Cases:**

- Budget change tracking
- Audit logging
- Budget planning analytics

---

## Event Flow Examples

### Creating a Transaction

```
User creates transaction
  ↓
CreateTransactionUseCase.execute()
  ↓
1. Validate account balance
2. Create transaction in database
3. Update account balance
  ↓
Emit Events:
  - transaction.created
  - account.balance.changed
  ↓
Event Handlers (potential):
  - Update spending analytics
  - Check budget thresholds
  - Send notifications
```

### Transferring Funds

```
User initiates transfer
  ↓
TransferFundsForHouseholdUseCase.execute()
  ↓
1. Validate accounts
2. Check sufficient funds
3. Update both account balances
  ↓
Emit Events:
  - account.funds.transferred
  - account.balance.changed (from account)
  - account.balance.changed (to account)
  ↓
Event Handlers (potential):
  - Update transfer history
  - Recalculate net worth
  - Send transfer confirmation
```

---

## Event Handler Best Practices

1. **Idempotent Handlers**: Ensure handlers can be safely executed multiple times with the same event
2. **Error Handling**: Wrap handler logic in try-catch to prevent one handler from breaking others
3. **Async Operations**: Use async/await for I/O operations
4. **Logging**: Log event processing for debugging and audit trails
5. **Performance**: Keep handlers lightweight; defer heavy processing to background jobs
6. **Dependencies**: Minimize dependencies between handlers to maintain loose coupling

---

## Adding New Events

When adding a new domain event:

1. Define the event class extending `DomainEvent` in the appropriate file under `src/domain/events/`
2. Export the event from `src/domain/events/index.ts`
3. Emit the event in the relevant use case using `EventEmitter2`
4. Document the event in this catalog
5. Create handlers as needed in a dedicated handlers directory

---

## Example Event Handler Implementation

This section provides a complete example of implementing event handlers for audit logging purposes. This code is provided as a reference and should only be implemented when specific business requirements arise.

### Complete Audit Log Event Handler

```typescript
import {Injectable} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {Logger} from 'pino-nestjs';
import {
  TransactionCreatedEvent,
  TransactionUpdatedEvent,
  TransactionDeletedEvent,
  AccountBalanceChangedEvent,
  FundsTransferredEvent,
} from '../../domain/events';

/**
 * Example event handler that demonstrates how to listen to and process domain events.
 * This handler logs all transaction and account events for audit trail purposes.
 *
 * Event handlers enable adding new functionality (analytics, notifications, etc.)
 * without modifying existing use case implementations.
 */
@Injectable()
export class AuditLogEventHandler {
  constructor(private readonly logger: Logger) {}

  @OnEvent('transaction.created')
  handleTransactionCreated(event: TransactionCreatedEvent) {
    this.logger.debug({
      event: 'transaction.created',
      transactionId: event.transactionId,
      accountId: event.accountId,
      householdId: event.householdId,
      amount: event.amount,
      type: event.type,
      categoryId: event.categoryId,
      occurredOn: event.occurredOn,
    });

    // Future implementations could:
    // - Store event in audit log table
    // - Send to external audit service
    // - Trigger compliance checks
  }

  @OnEvent('transaction.updated')
  handleTransactionUpdated(event: TransactionUpdatedEvent) {
    this.logger.debug({
      event: 'transaction.updated',
      transactionId: event.transactionId,
      householdId: event.householdId,
      changes: {
        amount: {old: event.oldAmount, new: event.newAmount},
        type: {old: event.oldType, new: event.newType},
        account: {old: event.oldAccountId, new: event.newAccountId},
        category: {old: event.oldCategoryId, new: event.newCategoryId},
      },
      occurredOn: event.occurredOn,
    });

    // Future implementations could:
    // - Track change history
    // - Alert on suspicious patterns
    // - Update analytics
  }

  @OnEvent('transaction.deleted')
  handleTransactionDeleted(event: TransactionDeletedEvent) {
    this.logger.debug({
      event: 'transaction.deleted',
      transactionId: event.transactionId,
      accountId: event.accountId,
      householdId: event.householdId,
      amount: event.amount,
      type: event.type,
      categoryId: event.categoryId,
      occurredOn: event.occurredOn,
    });

    // Future implementations could:
    // - Soft delete instead of hard delete
    // - Archive for compliance
    // - Notify stakeholders
  }

  @OnEvent('account.balance.changed')
  handleAccountBalanceChanged(event: AccountBalanceChangedEvent) {
    this.logger.debug({
      event: 'account.balance.changed',
      accountId: event.accountId,
      householdId: event.householdId,
      balanceChange: {
        old: event.oldBalance,
        new: event.newBalance,
        diff: event.newBalance - event.oldBalance,
      },
      reason: event.reason,
      metadata: event.metadata,
      occurredOn: event.occurredOn,
    });

    // Future implementations could:
    // - Check for low balance alerts
    // - Update real-time dashboards
    // - Recalculate net worth
  }

  @OnEvent('account.funds.transferred')
  handleFundsTransferred(event: FundsTransferredEvent) {
    this.logger.debug({
      event: 'account.funds.transferred',
      fromAccountId: event.fromAccountId,
      toAccountId: event.toAccountId,
      householdId: event.householdId,
      amount: event.amount,
      occurredOn: event.occurredOn,
    });

    // Future implementations could:
    // - Track transfer patterns
    // - Generate transfer receipts
    // - Update transfer history
  }
}
```

### Module Registration

To activate event handlers, create a module and register the handlers:

```typescript
import {Module} from '@nestjs/common';
import {AuditLogEventHandler} from './audit-log.event-handler';

@Module({
  providers: [
    AuditLogEventHandler,
    // Add more event handlers here as needed:
    // - AnalyticsEventHandler
    // - NotificationEventHandler
    // - BudgetAlertEventHandler
  ],
})
export class EventHandlersModule {}
```

Then import the module in `AppModule`:

```typescript
import {EventHandlersModule} from './application/event-handlers/event-handlers.module';

@Module({
  imports: [
    // ... other imports
    EventHandlersModule,
  ],
})
export class AppModule {}
```

### Directory Structure

When implementing event handlers, use this structure:

```
src/application/
└── event-handlers/
    ├── audit-log.event-handler.ts
    ├── event-handlers.module.ts
    └── index.ts
```

### Testing Event Handlers

Event handlers should be tested independently:

```typescript
describe('AuditLogEventHandler', () => {
  let handler: AuditLogEventHandler;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockLogger = {
      debug: jest.fn(),
    } as any;

    handler = new AuditLogEventHandler(mockLogger);
  });

  it('should log transaction created event', () => {
    const event = new TransactionCreatedEvent('txn-123', 'acc-456', 'hh-789', 100, TransactionType.EXPENSE, 'cat-999');

    handler.handleTransactionCreated(event);

    expect(mockLogger.debug).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'transaction.created',
        transactionId: 'txn-123',
        amount: 100,
      }),
    );
  });
});
```

---

## Event Naming Convention

Events follow the pattern: `{entity}.{action}` (e.g., `transaction.created`, `account.balance.changed`)

- **entity**: The domain object involved (transaction, account, category, etc.)
- **action**: Past tense verb describing what happened (created, updated, deleted, changed, etc.)
