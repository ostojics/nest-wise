import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {User} from 'src/users/user.entity';
import {Account} from 'src/accounts/account.entity';
import {Category} from 'src/categories/categories.entity';
import {Transaction} from 'src/transactions/transaction.entity';
import {License} from 'src/licenses/license.entity';

@Entity('households')
export class Household {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'char',
    length: 3,
    nullable: false,
    default: 'USD',
    name: 'currency_code',
  })
  currencyCode: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: false,
    default: 5000,
    name: 'monthly_budget',
  })
  monthlyBudget: number;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true,
    name: 'license_id',
  })
  licenseId: string;

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

  @OneToMany(() => User, (user) => user.household)
  users: User[];

  @OneToMany(() => Account, (account) => account.household)
  accounts: Account[];

  @OneToMany(() => Category, (category) => category.household)
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.household)
  transactions: Transaction[];

  @OneToOne(() => License, (license) => license.household)
  @JoinColumn({name: 'license_id'})
  license: License;

  /**
   * Domain method: Check if household can add a new member
   * @param maxMembers Maximum allowed members (default 8, configurable for license tiers)
   */
  canAddMember(maxMembers = 8): boolean {
    return this.users.length < maxMembers;
  }

  /**
   * Domain method: Check if household has reached member limit
   * @param maxMembers Maximum allowed members (default 8)
   */
  hasReachedMemberLimit(maxMembers = 8): boolean {
    return !this.canAddMember(maxMembers);
  }

  /**
   * Domain method: Get count of members in household
   * Requires users relation to be loaded
   */
  getMemberCount(): number {
    return this.users.length;
  }
}
