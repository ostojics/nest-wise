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
import {User} from 'src/users/user.entity';
import {TransactionType} from 'src/common/enums/transaction.type.enum';

@Entity('private_transactions')
export class PrivateTransaction {
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
    nullable: false,
    name: 'user_id',
  })
  @Index()
  userId: string;

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
  transactionDate: Date;

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

  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'user_id'})
  user: User;

  /**
   * Domain method: Check if transaction can be updated by a user
   * Only the owner can update their private transaction
   */
  canBeUpdated(userId: string): boolean {
    return this.belongsToUser(userId);
  }

  /**
   * Domain method: Check if transaction can be deleted by a user
   * Only the owner can delete their private transaction
   */
  canBeDeleted(userId: string): boolean {
    return this.belongsToUser(userId);
  }

  /**
   * Domain method: Check if transaction belongs to a specific user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
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
