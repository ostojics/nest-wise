import {Household} from '../households/household.entity';

/**
 * Dependency injection token for IHouseholdRepository
 */
export const HOUSEHOLD_REPOSITORY = Symbol('IHouseholdRepository');

/**
 * Repository interface for Household aggregate
 * Provides collection-like operations and queries
 */
export interface IHouseholdRepository {
  /**
   * Create a new household
   */
  create(householdData: Partial<Household>): Promise<Household>;

  /**
   * Find a household by ID
   */
  findById(id: string): Promise<Household | null>;

  /**
   * Find a household by ID with users relation loaded
   */
  findByIdWithUsers(id: string): Promise<Household | null>;

  /**
   * Find all households
   */
  findAll(): Promise<Household[]>;

  /**
   * Update a household
   */
  update(id: string, householdData: Partial<Household>): Promise<Household | null>;

  /**
   * Delete a household
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if household exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Get member count for a household
   */
  getMemberCount(householdId: string): Promise<number>;
}
