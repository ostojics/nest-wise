import {User} from '../users/user.entity';

/**
 * Dependency injection token for IUserRepository
 */
export const USER_REPOSITORY = Symbol('IUserRepository');

/**
 * Repository interface for User aggregate
 * Provides collection-like operations and queries
 */
export interface IUserRepository {
  /**
   * Create a new user
   */
  create(userData: Partial<User>): Promise<User>;

  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find a user by username
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Find all users for a household
   */
  findByHouseholdId(householdId: string): Promise<User[]>;

  /**
   * Find all users for a household with household relation loaded
   */
  findByHouseholdIdWithHousehold(householdId: string): Promise<User[]>;

  /**
   * Find all users
   */
  findAll(): Promise<User[]>;

  /**
   * Update a user
   */
  update(id: string, userData: Partial<User>): Promise<User | null>;

  /**
   * Delete a user
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if user exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if email exists
   */
  emailExists(email: string): Promise<boolean>;

  /**
   * Check if username exists
   */
  usernameExists(username: string): Promise<boolean>;
}
