import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {Household} from 'src/households/household.entity';
import {Category} from 'src/categories/categories.entity';

@Entity('category_budgets')
@Index(['householdId', 'categoryId', 'month'], {unique: true})
export class CategoryBudget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'household_id',
  })
  @Index()
  householdId: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'category_id',
  })
  @Index()
  categoryId: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
  })
  @Index()
  month: string; // 'YYYY-MM'

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: false,
    name: 'planned_amount',
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => Number(value),
    },
  })
  plannedAmount: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => Household, (household) => household.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'household_id'})
  household: Household;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'category_id'})
  category: Category;

  /**
   * Domain method: Check if spending is within budget
   * @param spentAmount The amount already spent in this category for this period
   */
  isWithinBudget(spentAmount: number): boolean {
    const planned = Number(this.plannedAmount);
    const spent = Number(spentAmount);
    return spent <= planned;
  }

  /**
   * Domain method: Calculate remaining budget
   * @param spentAmount The amount already spent in this category for this period
   * @returns Remaining budget (0 if negative)
   */
  getRemainingBudget(spentAmount: number): number {
    const planned = Number(this.plannedAmount);
    const spent = Number(spentAmount);
    const remaining = planned - spent;
    return remaining < 0 ? 0 : remaining;
  }

  /**
   * Domain method: Calculate percentage of budget used
   * @param spentAmount The amount already spent in this category for this period
   * @returns Percentage used (0-100+)
   */
  getPercentageUsed(spentAmount: number): number {
    const planned = Number(this.plannedAmount);
    const spent = Number(spentAmount);

    if (planned === 0) {
      return 0;
    }

    return (spent / planned) * 100;
  }

  /**
   * Domain method: Check if budget is exceeded
   * @param spentAmount The amount already spent in this category for this period
   */
  isOverBudget(spentAmount: number): boolean {
    const planned = Number(this.plannedAmount);
    const spent = Number(spentAmount);
    return spent > planned;
  }
}
