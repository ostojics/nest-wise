import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {Transaction} from './transaction.entity';
import {
  CreateTransactionDTO,
  GetTransactionsQueryDTO,
  GetTransactionsQueryHouseholdDTO,
  UpdateTransactionDTO,
  GetTransactionsResponseContract,
  TransactionContract,
  SortOrder,
  AccountSpendingPointContract,
  GetAccountsSpendingQueryDTO,
  GetAccountsSpendingQueryHouseholdDTO,
  NetWorthTrendPointContract,
  SpendingTotalContract,
  CategorySpendingPointContract,
  GetSpendingSummaryQueryHouseholdDTO,
} from '@nest-wise/contracts';
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
      transactionDate: new Date(transactionData.transactionDate),
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
      .leftJoin('transaction.account', 'account')
      .leftJoin('transaction.category', 'category')
      .addSelect(['account.id', 'account.name'])
      .addSelect(['category.id', 'category.name']);

    this.applyFilters(queryBuilder, query);
    this.applySorting(queryBuilder, query.sort);

    const totalCount = await queryBuilder.getCount();
    const pageSize = query.pageSize;
    const currentPage = query.page;
    const totalPages = Math.ceil(totalCount / pageSize);

    queryBuilder.skip((currentPage - 1) * pageSize).take(pageSize);

    const transactions = await queryBuilder.getMany();
    const data = transactions.map((tx) => ({
      ...tx,
      transactionDate: tx.transactionDate.toISOString(),
    })) as TransactionContract[];

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

  async findTransactionsWithFiltersForHousehold(
    householdId: string,
    query: GetTransactionsQueryHouseholdDTO,
  ): Promise<GetTransactionsResponseContract> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.account', 'account')
      .leftJoin('transaction.category', 'category')
      .addSelect(['account.id', 'account.name'])
      .addSelect(['category.id', 'category.name']);

    // Always filter by householdId
    queryBuilder.andWhere('transaction.householdId = :householdId', {householdId});

    this.applyFiltersForHousehold(queryBuilder, query);
    this.applySorting(queryBuilder, query.sort);

    const totalCount = await queryBuilder.getCount();
    const pageSize = query.pageSize;
    const currentPage = query.page;
    const totalPages = Math.ceil(totalCount / pageSize);

    queryBuilder.skip((currentPage - 1) * pageSize).take(pageSize);

    const transactions = await queryBuilder.getMany();
    const data = transactions.map((tx) => ({
      ...tx,
      transactionDate: tx.transactionDate.toISOString(),
    })) as TransactionContract[];

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
      queryBuilder.andWhere('transaction.transactionDate >= :dateFrom::date', {
        dateFrom: query.transactionDate_from,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('transaction.type = :type', {type: query.type as TransactionType});
    }

    if (query.transactionDate_to) {
      queryBuilder.andWhere("transaction.transactionDate < (:dateTo::date + INTERVAL '1 day')", {
        dateTo: query.transactionDate_to,
      });
    }

    if (query.q) {
      queryBuilder.andWhere('transaction.description ILIKE :q', {
        q: `%${query.q}%`,
      });
    }
  }

  private applyFiltersForHousehold(
    queryBuilder: SelectQueryBuilder<Transaction>,
    query: GetTransactionsQueryHouseholdDTO,
  ): void {
    if (query.accountId) {
      queryBuilder.andWhere('transaction.accountId = :accountId', {accountId: query.accountId});
    }

    if (query.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {categoryId: query.categoryId});
    }

    // Use simplified date parameters
    if (query.from) {
      queryBuilder.andWhere('transaction.transactionDate >= :dateFrom::date', {dateFrom: query.from});
    }

    if (query.to) {
      queryBuilder.andWhere("transaction.transactionDate < (:dateTo::date + INTERVAL '1 day')", {dateTo: query.to});
    }

    if (query.type) {
      queryBuilder.andWhere('transaction.type = :type', {type: query.type as TransactionType});
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
    const {type, transactionDate, ...otherData} = transactionData;
    const updateData = {
      ...otherData,
      ...(type && {type: type as TransactionType}),
      ...(transactionDate && {transactionDate: new Date(transactionDate)}),
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

  async getAccountsSpendingForHousehold(
    householdId: string,
    query: GetAccountsSpendingQueryDTO,
  ): Promise<AccountSpendingPointContract[]> {
    interface Row {
      account_id: string;
      name: string;
      amount: string | number | null;
    }

    const dateFrom = query.transactionDate_from;
    const dateTo = query.transactionDate_to;

    const rows: Row[] = await this.transactionRepository.query(
      `
      WITH params AS (
        SELECT
          $2::date AS date_from,
          $3::date AS date_to
      ),
      filtered_tx AS (
        SELECT t.account_id, t.amount
        FROM transactions t, params p
        WHERE t.household_id = $1
          AND t.type = 'expense'
          AND (p.date_from IS NULL OR t.transaction_date >= p.date_from)
          AND (p.date_to IS NULL OR t.transaction_date <= p.date_to)
      ),
      sums AS (
        SELECT account_id, SUM(amount)::numeric AS amount
        FROM filtered_tx
        GROUP BY account_id
      )
      SELECT a.id AS account_id, a.name, COALESCE(s.amount, 0)::numeric AS amount
      FROM accounts a
      LEFT JOIN sums s ON s.account_id = a.id
      WHERE a.household_id = $1
      ORDER BY a.name ASC;
      `,
      [householdId, dateFrom, dateTo],
    );

    return rows.map((r) => ({
      accountId: r.account_id,
      name: r.name,
      amount: r.amount === null ? 0 : Number(r.amount),
    }));
  }

  async getAccountsSpendingForHouseholdNew(
    householdId: string,
    query: GetAccountsSpendingQueryHouseholdDTO,
  ): Promise<AccountSpendingPointContract[]> {
    interface Row {
      account_id: string;
      name: string;
      amount: string | number | null;
    }

    // Use simplified date parameters
    const dateFrom = query.from;
    const dateTo = query.to;

    const rows: Row[] = await this.transactionRepository.query(
      `
      WITH params AS (
        SELECT
          $2::date AS date_from,
          $3::date AS date_to
      ),
      filtered_tx AS (
        SELECT t.account_id, t.amount
        FROM transactions t, params p
        WHERE t.household_id = $1
          AND t.type = 'expense'
          AND (p.date_from IS NULL OR t.transaction_date >= p.date_from)
          AND (p.date_to IS NULL OR t.transaction_date <= p.date_to)
      ),
      sums AS (
        SELECT account_id, SUM(amount)::numeric AS amount
        FROM filtered_tx
        GROUP BY account_id
      )
      SELECT a.id AS account_id, a.name, COALESCE(s.amount, 0)::numeric AS amount
      FROM accounts a
      LEFT JOIN sums s ON s.account_id = a.id
      WHERE a.household_id = $1
      ORDER BY a.name ASC;
      `,
      [householdId, dateFrom, dateTo],
    );

    return rows.map((r) => ({
      accountId: r.account_id,
      name: r.name,
      amount: r.amount === null ? 0 : Number(r.amount),
    }));
  }

  async getSpendingTotalForHousehold(
    householdId: string,
    query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<SpendingTotalContract> {
    interface Row {
      total: string | number | null;
      count: string | number | null;
    }

    // Use simplified date parameters
    const dateFrom = query.from;
    const dateTo = query.to;

    const rows: Row[] = await this.transactionRepository.query(
      `
      WITH params AS (
        SELECT
          $2::date AS date_from,
          $3::date AS date_to
      ),
      filtered_tx AS (
        SELECT t.amount
        FROM transactions t, params p
        WHERE t.household_id = $1
          AND t.type = 'expense'
          AND (p.date_from IS NULL OR t.transaction_date >= p.date_from)
          AND (p.date_to IS NULL OR t.transaction_date <= p.date_to)
      )
      SELECT 
        COALESCE(SUM(amount), 0)::numeric AS total,
        COUNT(*)::int AS count
      FROM filtered_tx;
      `,
      [householdId, dateFrom, dateTo],
    );

    const row = rows[0];
    return {
      total: row.total === null ? 0 : Number(row.total),
      count: row.count === null ? 0 : Number(row.count),
    };
  }

  async getCategoriesSpendingForHousehold(
    householdId: string,
    query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<CategorySpendingPointContract[]> {
    interface Row {
      category_id: string | null;
      category_name: string;
      amount: string | number | null;
    }

    // Use simplified date parameters
    const dateFrom = query.from;
    const dateTo = query.to;

    const rows: Row[] = await this.transactionRepository.query(
      `
      WITH params AS (
        SELECT
          $2::date AS date_from,
          $3::date AS date_to
      ),
      filtered_tx AS (
        SELECT t.category_id, t.amount
        FROM transactions t, params p
        WHERE t.household_id = $1
          AND t.type = 'expense'
          AND (p.date_from IS NULL OR t.transaction_date >= p.date_from)
          AND (p.date_to IS NULL OR t.transaction_date <= p.date_to)
      ),
      sums AS (
        SELECT category_id, SUM(amount)::numeric AS amount
        FROM filtered_tx
        GROUP BY category_id
      )
      SELECT 
        s.category_id,
        COALESCE(c.name, 'Other') AS category_name,
        COALESCE(s.amount, 0)::numeric AS amount
      FROM sums s
      LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.amount > 0
      ORDER BY s.amount DESC;
      `,
      [householdId, dateFrom, dateTo],
    );

    return rows.map((r) => ({
      categoryId: r.category_id,
      categoryName: r.category_name,
      amount: r.amount === null ? 0 : Number(r.amount),
    }));
  }
}
