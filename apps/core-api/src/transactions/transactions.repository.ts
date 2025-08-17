import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {NetWorthTrendPointContract} from '@maya-vault/contracts';
import {Transaction} from './transaction.entity';
import {CreateTransactionDTO, GetTransactionsQueryDTO, UpdateTransactionDTO} from '@maya-vault/validation';
import {GetTransactionsResponseContract, SortOrder, TransactionContract} from '@maya-vault/contracts';
import {TransactionType} from '../common/enums/transaction.type.enum';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(transactionData: CreateTransactionDTO): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...transactionData,
      type: transactionData.type as TransactionType,
    });
    return await this.transactionRepository.save(transaction);
  }

  async getNetWorthTrendForHousehold(householdId: string): Promise<NetWorthTrendPointContract[]> {
    interface NetWorthTrendRow {
      month: string;
      month_short: string;
      amount: string | number | null;
      has_data: boolean;
    }

    const rows: NetWorthTrendRow[] = await this.transactionRepository.query(
      `
      WITH params AS (
        SELECT
          (date_trunc('month', CURRENT_DATE) - INTERVAL '11 months')::date AS window_start,
          (date_trunc('month', CURRENT_DATE))::date AS window_start_current_month,
          (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date AS window_end_exclusive
      ),
      baseline AS (
        SELECT
          COALESCE((
            SELECT SUM(a.initial_balance)::numeric
            FROM accounts a
            WHERE a.household_id = $1
          ), 0)::numeric
          +
          COALESCE((
            SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END)::numeric
            FROM transactions t, params p
            WHERE t.household_id = $1
              AND t.transaction_date < p.window_start
          ), 0)::numeric AS baseline
      ),
      months AS (
        SELECT generate_series(
          (SELECT window_start FROM params),
          (SELECT window_start_current_month FROM params),
          INTERVAL '1 month'
        )::date AS month_start
      ),
      monthly_net AS (
        SELECT
          date_trunc('month', t.transaction_date)::date AS month_start,
          SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END)::numeric AS net_change,
          COUNT(*)::int AS tx_count
        FROM transactions t, params p
        WHERE t.household_id = $1
          AND t.transaction_date >= p.window_start
          AND t.transaction_date < p.window_end_exclusive
        GROUP BY 1
      ),
      series AS (
        SELECT
          m.month_start,
          COALESCE(mn.net_change, 0)::numeric AS net_change,
          COALESCE(mn.tx_count, 0)::int AS tx_count
        FROM months m
        LEFT JOIN monthly_net mn USING (month_start)
      ),
      accum AS (
        SELECT
          s.month_start,
          s.tx_count,
          SUM(s.net_change) OVER (ORDER BY s.month_start ROWS UNBOUNDED PRECEDING)::numeric AS cum_net_change,
          b.baseline
        FROM series s
        CROSS JOIN baseline b
      )
      SELECT
        to_char(a.month_start, 'FMMonth') AS month,
        to_char(a.month_start, 'Mon') AS month_short,
        (a.baseline + a.cum_net_change) AS amount,
        (a.tx_count > 0) AS has_data
      FROM accum a
      ORDER BY a.month_start ASC;
      `,
      [householdId],
    );

    return rows.map((r) => ({
      month: r.month,
      monthShort: r.month_short,
      amount: r.amount === null ? null : Number(r.amount),
      hasData: r.has_data,
    }));
  }

  async findById(id: string): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({
      where: {id},
      relations: ['account', 'category'],
    });
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: {accountId},
      relations: ['category'],
      order: {createdAt: 'DESC'},
    });
  }

  async findByHouseholdId(householdId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: {householdId},
      relations: ['account', 'category'],
      order: {createdAt: 'DESC'},
    });
  }

  async findTransactionsWithFilters(query: GetTransactionsQueryDTO): Promise<GetTransactionsResponseContract> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.category', 'category');

    this.applyFilters(queryBuilder, query);
    this.applySorting(queryBuilder, query.sort);

    const totalCount = await queryBuilder.getCount();
    const pageSize = query.pageSize;
    const currentPage = query.page;
    const totalPages = Math.ceil(totalCount / pageSize);

    queryBuilder.skip((currentPage - 1) * pageSize).take(pageSize);

    const data = (await queryBuilder.getMany()) as TransactionContract[];

    return {
      data,
      meta: {
        totalCount,
        pageSize,
        currentPage,
        totalPages,
      },
    };
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Transaction>, query: GetTransactionsQueryDTO): void {
    if (query.householdId) {
      queryBuilder.andWhere('transaction.householdId = :householdId', {householdId: query.householdId});
    }

    if (query.accountId) {
      queryBuilder.andWhere('transaction.accountId = :accountId', {accountId: query.accountId});
    }

    if (query.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {categoryId: query.categoryId});
    }

    if (query.transactionDate_from) {
      queryBuilder.andWhere('transaction.transactionDate >= :dateFrom', {
        dateFrom: query.transactionDate_from,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('transaction.type = :type', {type: query.type as TransactionType});
    }

    if (query.transactionDate_to) {
      queryBuilder.andWhere('transaction.transactionDate <= :dateTo', {
        dateTo: query.transactionDate_to,
      });
    }

    if (query.q) {
      queryBuilder.andWhere('transaction.description ILIKE :q', {
        q: `%${query.q}%`,
      });
    }
  }

  private applySorting(queryBuilder: SelectQueryBuilder<Transaction>, sort?: string): void {
    if (!sort) {
      queryBuilder.orderBy('transaction.transactionDate', SortOrder.DESC);
      return;
    }

    const isDescending = sort.startsWith('-');
    const fieldName = isDescending ? sort.slice(1) : sort;
    const direction = isDescending ? SortOrder.DESC : SortOrder.ASC;

    const columnName = `transaction.${fieldName}`;

    queryBuilder.orderBy(columnName, direction);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['account', 'category'],
      order: {createdAt: SortOrder.DESC},
    });
  }

  async update(id: string, transactionData: UpdateTransactionDTO): Promise<Transaction | null> {
    const {type, ...otherData} = transactionData;
    const updateData = {
      ...otherData,
      ...(type && {type: type as TransactionType}),
    };

    const updateResult = await this.transactionRepository.update(id, updateData);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.transactionRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.transactionRepository.count({where: {id}});
    return count > 0;
  }
}
