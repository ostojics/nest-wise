import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {Logger} from 'pino-nestjs';
import {ConfigService} from '@nestjs/config';
import {ScheduledTransactionsRepository} from './scheduled-transactions.repository';
import {
  ScheduledTransactionRule,
  ScheduledTransactionStatus,
  ScheduledTransactionFrequencyType,
} from './scheduled-transaction-rule.entity';
import {TransactionType} from '../common/enums/transaction.type.enum';
import {
  CreateScheduledTransactionRuleHouseholdDTO,
  UpdateScheduledTransactionRuleDTO,
  GetScheduledTransactionsQueryHouseholdDTO,
  GetScheduledTransactionsResponseContract,
} from '@nest-wise/contracts';
import {AccountsService} from '../accounts/accounts.service';
import {CategoriesService} from '../categories/categories.service';
import {AppConfig, AppConfigName} from '../config/app.config';
import {parseLocalDate, isLocalDateInPast} from './date.util';

@Injectable()
export class ScheduledTransactionsService {
  private readonly appTimezone: string;

  constructor(
    private readonly repository: ScheduledTransactionsRepository,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.appTimezone = appConfig.timezone;
  }

  async createRule(
    householdId: string,
    userId: string,
    data: CreateScheduledTransactionRuleHouseholdDTO,
  ): Promise<ScheduledTransactionRule> {
    // Validate account belongs to household
    const account = await this.accountsService.findAccountById(data.accountId);
    if (account.householdId !== householdId) {
      throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
    }

    // Validate category if provided and not income
    if (data.type === 'expense' && data.categoryId) {
      const category = await this.categoriesService.findCategoryById(data.categoryId);
      if (category.householdId !== householdId) {
        throw new BadRequestException('Kategorija ne pripada navedenom domaćinstvu');
      }
    }

    // Validate start date is not in the past
    const startDate = parseLocalDate(data.startDate);
    if (isLocalDateInPast(startDate, this.appTimezone)) {
      throw new BadRequestException('Datum početka ne može biti u prošlosti');
    }

    // Validate frequency-specific fields
    this.validateFrequencyFields(
      data.frequencyType as ScheduledTransactionFrequencyType,
      data.dayOfWeek,
      data.dayOfMonth,
    );

    const rule = await this.repository.create({
      householdId,
      createdByUserId: userId,
      accountId: data.accountId,
      categoryId: data.categoryId,
      type: data.type as TransactionType,
      amount: data.amount,
      description: data.description,
      frequencyType: data.frequencyType as ScheduledTransactionFrequencyType,
      dayOfWeek: data.dayOfWeek,
      dayOfMonth: data.dayOfMonth,
      startDate,
      postedTimeLocal: '12:00:00',
      status: ScheduledTransactionStatus.ACTIVE,
    });

    this.logger.debug(`Created scheduled transaction rule ${rule.id}`, {
      ruleId: rule.id,
      householdId,
      userId,
    });

    return rule;
  }

  async findRuleById(id: string): Promise<ScheduledTransactionRule> {
    const rule = await this.repository.findById(id);
    if (!rule) {
      throw new NotFoundException('Pravilo nije pronađeno');
    }
    return rule;
  }

  async findRulesForHousehold(
    householdId: string,
    query: GetScheduledTransactionsQueryHouseholdDTO,
  ): Promise<GetScheduledTransactionsResponseContract> {
    return await this.repository.findWithFiltersForHousehold(householdId, query);
  }

  async updateRule(
    id: string,
    householdId: string,
    data: UpdateScheduledTransactionRuleDTO,
  ): Promise<ScheduledTransactionRule> {
    const existingRule = await this.findRuleById(id);

    // Verify rule belongs to household
    if (existingRule.householdId !== householdId) {
      throw new BadRequestException('Pravilo ne pripada navedenom domaćinstvu');
    }

    // Validate account if being changed
    if (data.accountId) {
      const account = await this.accountsService.findAccountById(data.accountId);
      if (account.householdId !== householdId) {
        throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
      }
    }

    // Validate category if being changed
    if (data.categoryId !== undefined) {
      if (data.categoryId !== null) {
        const category = await this.categoriesService.findCategoryById(data.categoryId);
        if (category.householdId !== householdId) {
          throw new BadRequestException('Kategorija ne pripada navedenom domaćinstvu');
        }
      }
    }

    // Handle type change to income (force categoryId to null)
    if (data.type === 'income') {
      data.categoryId = null;
    }

    // Validate frequency fields if being changed
    const frequencyType = data.frequencyType ?? existingRule.frequencyType;
    const dayOfWeek = data.dayOfWeek !== undefined ? data.dayOfWeek : existingRule.dayOfWeek;
    const dayOfMonth = data.dayOfMonth !== undefined ? data.dayOfMonth : existingRule.dayOfMonth;
    this.validateFrequencyFields(frequencyType, dayOfWeek, dayOfMonth);

    // Validate start date if being changed
    if (data.startDate) {
      const startDate = parseLocalDate(data.startDate);
      if (isLocalDateInPast(startDate, this.appTimezone)) {
        throw new BadRequestException('Datum početka ne može biti u prošlosti');
      }
    }

    const updateData: Partial<ScheduledTransactionRule> = {
      ...data,
      type: data.type ? (data.type as TransactionType) : undefined,
      frequencyType: data.frequencyType ? (data.frequencyType as ScheduledTransactionFrequencyType) : undefined,
      startDate: data.startDate ? parseLocalDate(data.startDate) : undefined,
    };

    const updatedRule = await this.repository.updateRule(id, updateData);
    if (!updatedRule) {
      throw new NotFoundException('Pravilo nije pronađeno');
    }

    this.logger.debug(`Updated scheduled transaction rule ${id}`, {ruleId: id, householdId});

    return updatedRule;
  }

  async pauseRule(id: string, householdId: string): Promise<ScheduledTransactionRule> {
    const rule = await this.findRuleById(id);

    if (rule.householdId !== householdId) {
      throw new BadRequestException('Pravilo ne pripada navedenom domaćinstvu');
    }

    if (rule.status === ScheduledTransactionStatus.PAUSED) {
      throw new BadRequestException('Pravilo je već pauzirano');
    }

    const updatedRule = await this.repository.updateRule(id, {status: ScheduledTransactionStatus.PAUSED});
    if (!updatedRule) {
      throw new NotFoundException('Pravilo nije pronađeno');
    }

    this.logger.debug(`Paused scheduled transaction rule ${id}`, {ruleId: id, householdId});

    return updatedRule;
  }

  async resumeRule(id: string, householdId: string): Promise<ScheduledTransactionRule> {
    const rule = await this.findRuleById(id);

    if (rule.householdId !== householdId) {
      throw new BadRequestException('Pravilo ne pripada navedenom domaćinstvu');
    }

    if (rule.status === ScheduledTransactionStatus.ACTIVE) {
      throw new BadRequestException('Pravilo je već aktivno');
    }

    const updatedRule = await this.repository.updateRule(id, {status: ScheduledTransactionStatus.ACTIVE});
    if (!updatedRule) {
      throw new NotFoundException('Pravilo nije pronađeno');
    }

    this.logger.debug(`Resumed scheduled transaction rule ${id}`, {ruleId: id, householdId});

    return updatedRule;
  }

  async deleteRule(id: string, householdId: string): Promise<void> {
    const rule = await this.findRuleById(id);

    if (rule.householdId !== householdId) {
      throw new BadRequestException('Pravilo ne pripada navedenom domaćinstvu');
    }

    const deleted = await this.repository.deleteRule(id);
    if (!deleted) {
      throw new NotFoundException('Pravilo nije pronađeno');
    }

    this.logger.debug(`Deleted scheduled transaction rule ${id}`, {ruleId: id, householdId});
  }

  private validateFrequencyFields(
    frequencyType: ScheduledTransactionFrequencyType | string,
    dayOfWeek: number | null | undefined,
    dayOfMonth: number | null | undefined,
  ): void {
    const freqTypeStr = String(frequencyType);
    if (freqTypeStr === String(ScheduledTransactionFrequencyType.WEEKLY)) {
      if (dayOfWeek === null || dayOfWeek === undefined) {
        throw new BadRequestException('dayOfWeek je obavezan za nedeljnu frekvenciju');
      }
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        throw new BadRequestException('dayOfWeek mora biti između 0 i 6');
      }
    }

    if (freqTypeStr === String(ScheduledTransactionFrequencyType.MONTHLY)) {
      if (dayOfMonth === null || dayOfMonth === undefined) {
        throw new BadRequestException('dayOfMonth je obavezan za mesečnu frekvenciju');
      }
      if (dayOfMonth < 1 || dayOfMonth > 31) {
        throw new BadRequestException('dayOfMonth mora biti između 1 i 31');
      }
    }
  }
}
