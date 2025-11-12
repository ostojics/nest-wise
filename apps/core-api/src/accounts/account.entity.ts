import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {Household} from 'src/households/household.entity';
import {User} from 'src/users/user.entity';
import {Transaction} from 'src/transactions/transaction.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'owner_id',
  })
  @Index()
  ownerId: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'household_id',
  })
  @Index()
  householdId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: false,
    default: 0.0,
    name: 'initial_balance',
  })
  initialBalance: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: false,
    default: 0.0,
    name: 'current_balance',
  })
  currentBalance: number;

  @Column({
    type: 'boolean',
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

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

  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'owner_id'})
  owner: User;

  @ManyToOne(() => Household, (household) => household.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'household_id'})
  household: Household;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  /**
   * Domain method: Withdraw funds from the account
   * Encapsulates the business rule that balance cannot go below zero
   * @param amount Amount to withdraw
   * @throws Error if insufficient funds
   */
  withdraw(amount: number): void {
    const currentBalance = Number(this.currentBalance);
    const withdrawAmount = Number(amount);

    if (currentBalance < withdrawAmount) {
      throw new Error('Nedovoljno sredstava za ovaj rashod');
    }

    this.currentBalance = currentBalance - withdrawAmount;
  }

  /**
   * Domain method: Deposit funds into the account
   * @param amount Amount to deposit
   */
  deposit(amount: number): void {
    const currentBalance = Number(this.currentBalance);
    const depositAmount = Number(amount);

    this.currentBalance = currentBalance + depositAmount;
  }

  /**
   * Domain method: Check if account has sufficient funds
   * @param amount Amount to check
   * @returns true if account has sufficient funds
   */
  hasSufficientFunds(amount: number): boolean {
    return Number(this.currentBalance) >= Number(amount);
  }

  /**
   * Domain method: Apply a transaction effect to the account balance
   * @param amount Transaction amount
   * @param isIncome Whether this is income (true) or expense (false)
   */
  applyTransactionEffect(amount: number, isIncome: boolean): void {
    if (isIncome) {
      this.deposit(amount);
    } else {
      this.withdraw(amount);
    }
  }
}
