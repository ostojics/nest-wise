import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {BudgetAllocation} from './budget-allocation.entity';

@Entity('budget_allocation_categories')
@Index(['budgetAllocationId', 'name'], {unique: true})
export class BudgetAllocationCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'budget_allocation_id',
  })
  @Index()
  budgetAllocationId: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'smallint',
    nullable: false,
  })
  percentage: number;

  @Column({
    type: 'smallint',
    nullable: false,
    name: 'display_order',
    default: 0,
  })
  displayOrder: number;

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

  @ManyToOne(() => BudgetAllocation, (budgetAllocation) => budgetAllocation.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'budget_allocation_id'})
  budgetAllocation: BudgetAllocation;
}
