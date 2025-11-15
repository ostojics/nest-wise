import {PrivateTransaction} from '../private-transactions/private-transactions.entity';
import {GetPrivateTransactionsQueryDTO, GetPrivateTransactionsResponseContract} from '@nest-wise/contracts';

/**
 * Dependency injection token for IPrivateTransactionRepository
 */
export const PRIVATE_TRANSACTION_REPOSITORY = Symbol('IPrivateTransactionRepository');

/**
 * Repository interface for PrivateTransaction aggregate
 * Provides collection-like operations and queries
 */
export interface IPrivateTransactionRepository {
  /**
   * Create a new private transaction
   */
  create(transactionData: Partial<PrivateTransaction>): Promise<PrivateTransaction>;

  /**
   * Find a private transaction by ID
   */
  findById(id: string): Promise<PrivateTransaction | null>;

  /**
   * Find a private transaction by ID and user
   */
  findByIdAndUser(id: string, userId: string, householdId: string): Promise<PrivateTransaction | null>;

  /**
   * Find all private transactions for a user
   */
  findByUser(userId: string, householdId: string): Promise<PrivateTransaction[]>;

  /**
   * Find private transactions with filters and pagination
   */
  findWithFilters(
    userId: string,
    query: GetPrivateTransactionsQueryDTO,
  ): Promise<GetPrivateTransactionsResponseContract>;

  /**
   * Update a private transaction
   */
  update(id: string, transactionData: Partial<PrivateTransaction>): Promise<PrivateTransaction | null>;

  /**
   * Delete a private transaction
   */
  delete(id: string): Promise<boolean>;
}
