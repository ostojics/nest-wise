import {
  CreateTransactionDTO,
  GetTransactionsQueryDTO,
  GetTransactionsQueryHouseholdDTO,
  UpdateTransactionDTO,
  GetTransactionsResponseContract,
  AccountSpendingPointContract,
  GetAccountsSpendingQueryDTO,
  GetAccountsSpendingQueryHouseholdDTO,
  NetWorthTrendPointContract,
  SpendingTotalContract,
  CategorySpendingPointContract,
  GetSpendingSummaryQueryHouseholdDTO,
} from '@nest-wise/contracts';
import {Transaction} from '../../transactions/transaction.entity';

/**
 * Dependency injection token for ITransactionRepository
 */
export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository');

/**
 * Repository interface for Transaction aggregate
 * Provides collection-like operations and complex read queries
 */
export interface ITransactionRepository {
  /**
   * Create a new transaction
   */
  create(transactionData: CreateTransactionDTO): Promise<Transaction>;

  /**
   * Find a transaction by ID
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Find transactions by account ID
   */
  findByAccountId(accountId: string): Promise<Transaction[]>;

  /**
   * Find transactions by household ID
   */
  findByHouseholdId(householdId: string): Promise<Transaction[]>;

  /**
   * Find transactions with filters
   */
  findTransactionsWithFilters(query: GetTransactionsQueryDTO): Promise<GetTransactionsResponseContract>;

  /**
   * Find transactions with filters for a specific household
   */
  findTransactionsWithFiltersForHousehold(
    householdId: string,
    query: GetTransactionsQueryHouseholdDTO,
  ): Promise<GetTransactionsResponseContract>;

  /**
   * Update a transaction
   */
  update(id: string, transactionData: UpdateTransactionDTO): Promise<Transaction | null>;

  /**
   * Delete a transaction
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get net worth trend for a household
   */
  getNetWorthTrendForHousehold(householdId: string): Promise<NetWorthTrendPointContract[]>;

  /**
   * Get accounts spending for a household
   */
  getAccountsSpendingForHousehold(
    householdId: string,
    query: GetAccountsSpendingQueryDTO,
  ): Promise<AccountSpendingPointContract[]>;

  /**
   * Get accounts spending for a household (new version)
   */
  getAccountsSpendingForHouseholdNew(
    householdId: string,
    query: GetAccountsSpendingQueryHouseholdDTO,
  ): Promise<AccountSpendingPointContract[]>;

  /**
   * Get spending total for a household
   */
  getSpendingTotalForHousehold(
    householdId: string,
    query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<SpendingTotalContract>;

  /**
   * Get categories spending for a household
   */
  getCategoriesSpendingForHousehold(
    householdId: string,
    query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<CategorySpendingPointContract[]>;
}
