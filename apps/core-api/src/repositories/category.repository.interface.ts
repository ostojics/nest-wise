import {Category} from '../categories/categories.entity';

/**
 * Dependency injection token for ICategoryRepository
 */
export const CATEGORY_REPOSITORY = Symbol('ICategoryRepository');

/**
 * Repository interface for Category aggregate
 * Provides collection-like operations and queries
 */
export interface ICategoryRepository {
  /**
   * Create a new category
   */
  create(categoryData: Partial<Category>): Promise<Category>;

  /**
   * Find a category by ID
   */
  findById(id: string): Promise<Category | null>;

  /**
   * Find a category by ID and household ID
   */
  findByIdAndHousehold(id: string, householdId: string): Promise<Category | null>;

  /**
   * Find all categories for a household
   */
  findByHouseholdId(householdId: string): Promise<Category[]>;

  /**
   * Find all categories
   */
  findAll(): Promise<Category[]>;

  /**
   * Update a category
   */
  update(id: string, categoryData: Partial<Category>): Promise<Category | null>;

  /**
   * Delete a category
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if category exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if a category name exists for a household
   */
  nameExistsForHousehold(name: string, householdId: string): Promise<boolean>;

  /**
   * Count categories for a household
   */
  countByHousehold(householdId: string): Promise<number>;

  /**
   * Check if category has associated transactions
   */
  hasTransactions(categoryId: string): Promise<boolean>;
}
