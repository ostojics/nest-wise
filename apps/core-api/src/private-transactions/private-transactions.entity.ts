import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  ValueTransformer,
} from 'typeorm';
import {Household} from 'src/households/household.entity';
import {Account} from 'src/accounts/account.entity';
import {User} from 'src/users/user.entity';
import {TransactionType} from 'src/common/enums/transaction.type.enum';
import {formatDateOnly} from 'src/lib/date.util';

// Transformer to ensure transactionDate is always serialized as YYYY-MM-DD string
const dateOnlyTransformer: ValueTransformer = {
  to: (value: Date | string | undefined): Date | undefined => {
    // When writing to database, accept Date objects as-is (TypeORM handles conversion)
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    return undefined;
  },
  from: (value: Date | string | undefined): string | undefined => {
    // When reading from database, always return as YYYY-MM-DD string
    if (value instanceof Date) return formatDateOnly(value);
    if (typeof value === 'string') return value;
    return undefined;
  },
};

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
    type: 'date',
    nullable: false,
    name: 'transaction_date',
    transformer: dateOnlyTransformer,
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
}
