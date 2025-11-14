import {CategoryBudget} from '../category-budgets/category-budgets.entity';

/**
 * Dependency injection token for ICategoryBudgetRepository
 */
export const CATEGORY_BUDGET_REPOSITORY = Symbol('ICategoryBudgetRepository');

/**
 * Repository interface for CategoryBudget aggregate
 * Provides collection-like operations and queries
 */
export interface ICategoryBudgetRepository {
  /**
   * Create a new category budget
   */
  create(budgetData: Partial<CategoryBudget>): Promise<CategoryBudget>;

  /**
   * Create multiple category budgets
   */
  createMany(budgets: Partial<CategoryBudget>[]): Promise<CategoryBudget[]>;

  /**
   * Find a category budget by ID
   */
  findById(id: string): Promise<CategoryBudget | null>;

  /**
   * Find a category budget by ID and household
   */
  findByIdAndHousehold(id: string, householdId: string): Promise<CategoryBudget | null>;

  /**
   * Find all category budgets for a household
   */
  findByHousehold(householdId: string): Promise<CategoryBudget[]>;

  /**
   * Find all category budgets for a household and month
   */
  findByHouseholdAndMonth(householdId: string, month: string): Promise<CategoryBudget[]>;

  /**
   * Find category budget by category and period
   */
  findByCategoryAndPeriod(categoryId: string, month: string): Promise<CategoryBudget | null>;

  /**
   * Update a category budget
   */
  update(id: string, budgetData: Partial<CategoryBudget>): Promise<CategoryBudget | null>;

  /**
   * Update planned amount for a budget
   */
  updatePlannedAmount(id: string, plannedAmount: number): Promise<CategoryBudget | null>;

  /**
   * Delete a category budget
   */
  delete(id: string): Promise<boolean>;
}
