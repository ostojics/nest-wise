import {DomainEvent} from './base.event';

export class AccountBalanceChangedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly householdId: string,
    public readonly oldBalance: number,
    public readonly newBalance: number,
    public readonly reason: 'transaction' | 'transfer' | 'adjustment',
    public readonly metadata?: Record<string, unknown>,
  ) {
    super('account.balance.changed');
  }
}

export class FundsTransferredEvent extends DomainEvent {
  constructor(
    public readonly fromAccountId: string,
    public readonly toAccountId: string,
    public readonly householdId: string,
    public readonly amount: number,
  ) {
    super('account.funds.transferred');
  }
}
