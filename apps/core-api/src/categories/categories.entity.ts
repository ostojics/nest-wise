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
import {Transaction} from 'src/transactions/transaction.entity';

@Entity('categories')
@Index(['householdId', 'name'], {unique: true})
export class Category {
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
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string | null;

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

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  /**
   * Domain method: Check if category can be deleted
   * Category cannot be deleted if it has transactions or budgets
   * Note: This method assumes transactions are loaded. For checking budgets,
   * we'd need to query the repository which should be done in the service layer.
   */
  canBeDeleted(): boolean {
    // Check if has transactions (if loaded)
    return this.transactions.length === 0;
  }

  /**
   * Domain method: Check if category has transactions
   * Requires transactions to be loaded via relations
   */
  hasTransactions(): boolean {
    return this.transactions.length > 0;
  }
}
