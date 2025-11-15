import {TransactionType} from '../../common/enums/transaction.type.enum';
import {DomainEvent} from './base.event';

export class TransactionCreatedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly householdId: string,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly categoryId: string | null,
  ) {
    super('transaction.created');
  }
}

export class TransactionUpdatedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly householdId: string,
    public readonly oldAmount: number,
    public readonly newAmount: number,
    public readonly oldType: TransactionType,
    public readonly newType: TransactionType,
    public readonly oldAccountId: string,
    public readonly newAccountId: string,
    public readonly oldCategoryId: string | null,
    public readonly newCategoryId: string | null,
  ) {
    super('transaction.updated');
  }
}

export class TransactionDeletedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly householdId: string,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly categoryId: string | null,
  ) {
    super('transaction.deleted');
  }
}
