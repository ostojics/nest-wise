import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ScheduledTransactionRule, ScheduledTransactionStatus} from './scheduled-transaction-rule.entity';
import {
  GetScheduledTransactionsQueryHouseholdDTO,
  GetScheduledTransactionsResponseContract,
} from '@nest-wise/contracts';
import {ScheduledTransactionRulesMapper} from './mappers/scheduled-transaction-rules.mapper';

@Injectable()
export class ScheduledTransactionsRepository {
  constructor(
    @InjectRepository(ScheduledTransactionRule)
    private readonly repository: Repository<ScheduledTransactionRule>,
  ) {}

  async create(data: Partial<ScheduledTransactionRule>): Promise<ScheduledTransactionRule> {
    const rule = this.repository.create(data);
    return await this.repository.save(rule);
  }

  async findById(id: string): Promise<ScheduledTransactionRule | null> {
    return await this.repository.findOne({where: {id}});
  }

  async findByHouseholdId(householdId: string): Promise<ScheduledTransactionRule[]> {
    return await this.repository.find({
      where: {householdId},
      order: {createdAt: 'DESC'},
    });
  }

  async findDueRules(todayUTC: Date): Promise<ScheduledTransactionRule[]> {
    const query = this.repository
      .createQueryBuilder('rule')
      .where('rule.status = :status', {status: ScheduledTransactionStatus.ACTIVE})
      .andWhere('rule.start_date <= :todayUTC', {todayUTC})
      .andWhere('(rule.last_run_date IS NULL OR rule.last_run_date < :todayUTC)', {
        todayUTC,
      });

    return await query.getMany();
  }

  async findWithFiltersForHousehold(
    householdId: string,
    query: GetScheduledTransactionsQueryHouseholdDTO,
  ): Promise<GetScheduledTransactionsResponseContract> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.repository
      .createQueryBuilder('rule')
      .where('rule.household_id = :householdId', {householdId});

    // Apply status filter
    if (query.status) {
      queryBuilder.andWhere('rule.status = :status', {status: query.status});
    }

    // Apply sorting
    const sort = query.sort ?? '-createdAt';
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    // Map sort field to column name
    const columnMap: Record<string, string> = {
      createdAt: 'rule.created_at',
      startDate: 'rule.start_date',
      amount: 'rule.amount',
      status: 'rule.status',
    };

    const column = columnMap[sortField] || 'rule.created_at';
    queryBuilder.orderBy(column, sortOrder);

    // Get total count
    const totalCount = await queryBuilder.getCount();

    // Get paginated results
    const data = await queryBuilder.skip(skip).take(pageSize).getMany();

    return {
      data: data.map((rule) => ScheduledTransactionRulesMapper.toContract(rule)),
      meta: {
        totalCount,
        pageSize,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async updateRule(id: string, data: Partial<ScheduledTransactionRule>): Promise<ScheduledTransactionRule | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async deleteRule(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  async updateLastRun(id: string, date: Date): Promise<void> {
    await this.repository.update(id, {lastRunDate: date});
  }

  async incrementFailureCount(id: string, error: string): Promise<void> {
    await this.repository.increment({id}, 'failureCount', 1);
    await this.repository.update(id, {lastError: error});
  }

  async resetFailureCount(id: string): Promise<void> {
    await this.repository.update(id, {failureCount: 0, lastError: null});
  }
}
