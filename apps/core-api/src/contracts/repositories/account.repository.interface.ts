import {Account} from '../../accounts/account.entity';

/**
 * Dependency injection token for IAccountRepository
 */
export const ACCOUNT_REPOSITORY = Symbol('IAccountRepository');

/**
 * Repository interface for Account aggregate
 * Provides collection-like operations and queries
 */
export interface IAccountRepository {
  /**
   * Create a new account
   */
  create(accountData: Partial<Account>): Promise<Account>;

  /**
   * Find an account by ID
   */
  findById(id: string): Promise<Account | null>;

  /**
   * Find all accounts for a household
   */
  findByHouseholdId(householdId: string, options?: {isActive?: boolean}): Promise<Account[]>;

  /**
   * Find all accounts
   */
  findAll(): Promise<Account[]>;

  /**
   * Update an account
   */
  update(id: string, accountData: Partial<Account>): Promise<Account | null>;

  /**
   * Delete an account
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if account exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if an account name exists for a household
   */
  nameExistsForHousehold(name: string, householdId: string): Promise<boolean>;
}
