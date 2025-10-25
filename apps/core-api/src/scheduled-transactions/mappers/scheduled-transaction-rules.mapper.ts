import {ScheduledTransactionRuleContract} from '@nest-wise/contracts';
import {ScheduledTransactionRule} from '../scheduled-transaction-rule.entity';

export class ScheduledTransactionRulesMapper {
  static toContract(rule: ScheduledTransactionRule): ScheduledTransactionRuleContract {
    return {
      id: rule.id,
      householdId: rule.householdId,
      userId: rule.createdBy,
      accountId: rule.accountId,
      categoryId: rule.categoryId,
      type: rule.type,
      amount: Number(rule.amount),
      description: rule.description,
      frequencyType: rule.frequencyType,
      dayOfWeek: rule.dayOfWeek,
      dayOfMonth: rule.dayOfMonth,
      startDate: rule.startDate.toISOString(),
      status: rule.status,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }
}
