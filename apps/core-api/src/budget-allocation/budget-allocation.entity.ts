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

@Entity('budget_allocations')
@Index(['householdId', 'month'], {unique: true})
export class BudgetAllocation {
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
    type: 'varchar',
    length: 7,
    nullable: false,
  })
  @Index()
  month: string; // 'YYYY-MM'

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
    name: 'salary_amount',
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => Number(value),
    },
  })
  salaryAmount: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
    name: 'fixed_bills_amount',
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => Number(value),
    },
  })
  fixedBillsAmount: number;

  @Column({
    type: 'smallint',
    nullable: false,
    default: 25,
    name: 'spending_percentage',
  })
  spendingPercentage: number;

  @Column({
    type: 'smallint',
    nullable: false,
    default: 65,
    name: 'investing_percentage',
  })
  investingPercentage: number;

  @Column({
    type: 'smallint',
    nullable: false,
    default: 10,
    name: 'giving_percentage',
  })
  givingPercentage: number;

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

  @ManyToOne(() => Household, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'household_id'})
  household: Household;
}
