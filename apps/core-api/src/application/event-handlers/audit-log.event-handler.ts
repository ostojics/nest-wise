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
