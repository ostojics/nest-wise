import {DomainEvent} from './base.event';

export class CategoryBudgetExceededEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly householdId: string,
    public readonly month: string,
    public readonly plannedAmount: number,
    public readonly currentAmount: number,
    public readonly exceedAmount: number,
  ) {
    super('category.budget.exceeded');
  }
}

export class CategoryBudgetUpdatedEvent extends DomainEvent {
  constructor(
    public readonly categoryBudgetId: string,
    public readonly categoryId: string,
    public readonly householdId: string,
    public readonly month: string,
    public readonly oldPlannedAmount: number,
    public readonly newPlannedAmount: number,
  ) {
    super('category.budget.updated');
  }
}
