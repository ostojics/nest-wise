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
import {Account} from 'src/accounts/account.entity';
import {Category} from 'src/categories/categories.entity';
import {TransactionType} from 'src/common/enums/transaction.type.enum';

@Entity('transactions')
export class Transaction {
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
    name: 'account_id',
  })
  @Index()
  accountId: string;

  @Column({
    type: 'uuid',
    nullable: true,
    name: 'category_id',
  })
  @Index()
  categoryId: string | null;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  type: TransactionType;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'timestamptz',
    nullable: false,
    name: 'transaction_date',
  })
  @Index()
  transactionDate: Date;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'is_reconciled',
  })
  isReconciled: boolean;

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

  @ManyToOne(() => Household, (household) => household.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'household_id'})
  household: Household;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'account_id'})
  account: Account;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({name: 'category_id'})
  category: Category | null;

  /**
   * Domain method: Check if transaction can be updated
   * Currently all transactions can be updated by household members
   * Future: Add rules for scheduled transactions or reconciled transactions
   */
  canBeUpdated(): boolean {
    // For now, all transactions can be updated
    // In the future, add rules like:
    // - Cannot update if from scheduled rule
    // - Cannot update if reconciled (unless specific permission)
    return true;
  }

  /**
   * Domain method: Check if transaction can be deleted
   * Same rules as update for now
   */
  canBeDeleted(): boolean {
    return this.canBeUpdated();
  }

  /**
   * Domain method: Apply transaction effect to account balance
   * Delegates to account's domain method
   */
  applyToAccount(account: Account): void {
    const amount = Number(this.amount);
    const isIncome = this.type === TransactionType.INCOME;
    account.applyTransactionEffect(amount, isIncome);
  }

  /**
   * Domain method: Check if this is an income transaction
   */
  isIncome(): boolean {
    return this.type === TransactionType.INCOME;
  }

  /**
   * Domain method: Check if this is an expense transaction
   */
  isExpense(): boolean {
    return this.type === TransactionType.EXPENSE;
  }
}
