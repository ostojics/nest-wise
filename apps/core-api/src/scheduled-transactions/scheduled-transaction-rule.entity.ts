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
import {User} from 'src/users/user.entity';
import {Account} from 'src/accounts/account.entity';
import {Category} from 'src/categories/categories.entity';
import {TransactionType} from 'src/common/enums/transaction.type.enum';

export enum ScheduledTransactionFrequencyType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum ScheduledTransactionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
}

@Entity('scheduled_transaction_rules')
export class ScheduledTransactionRule {
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
    name: 'created_by',
  })
  createdBy: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'account_id',
  })
  @Index()
  accountId: string;

  @Column({
    type: 'uuid',
    nullable: true,
    name: 'category_id',
  })
  categoryId: string | null;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  type: TransactionType;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'enum',
    enum: ScheduledTransactionFrequencyType,
    nullable: false,
    name: 'frequency_type',
  })
  frequencyType: ScheduledTransactionFrequencyType;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'day_of_week',
  })
  dayOfWeek: number | null;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'day_of_month',
  })
  dayOfMonth: number | null;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'start_date',
  })
  startDate: Date;

  @Column({
    type: 'enum',
    enum: ScheduledTransactionStatus,
    nullable: false,
    default: ScheduledTransactionStatus.ACTIVE,
  })
  @Index()
  status: ScheduledTransactionStatus;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    name: 'last_run_date',
  })
  lastRunDate: Date | null;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
    name: 'failure_count',
  })
  failureCount: number;

  @Column({
    type: 'text',
    nullable: true,
    name: 'last_error',
  })
  lastError: string | null;

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

  @ManyToOne(() => Household, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'household_id'})
  household: Household;

  @ManyToOne(() => User, {onDelete: 'RESTRICT'})
  @JoinColumn({name: 'created_by'})
  createdByUser: User;

  @ManyToOne(() => Account, {onDelete: 'RESTRICT'})
  @JoinColumn({name: 'account_id'})
  account: Account;

  @ManyToOne(() => Category, {onDelete: 'SET NULL', nullable: true})
  @JoinColumn({name: 'category_id'})
  category: Category | null;
}
