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
import {Account} from 'src/accounts/account.entity';

@Entity('users')
export class User {
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
    length: 50,
    unique: true,
    nullable: false,
  })
  @Index()
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  @Index()
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'password_hash',
  })
  passwordHash: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'is_household_author',
  })
  isHouseholdAuthor: boolean;

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

  @ManyToOne(() => Household, (household) => household.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'household_id'})
  household: Household;

  @OneToMany(() => Account, (account) => account.owner)
  accounts: Account[];

  /**
   * Domain method: Check if user can join a household
   * User cannot join if already in a household or if household is full
   * @param household The household to check
   */
  canJoinHousehold(household: Household): boolean {
    // User already has a household - cannot join another
    // (In the current implementation, users are always part of a household)
    // This method is here for future multi-household support

    // Check if household can accept new members
    if (!household.canAddMember()) {
      return false;
    }

    return true;
  }

  /**
   * Domain method: Check if user has a specific permission
   * Placeholder for future role-based permissions
   * Currently all users have equal permissions within their household
   */
  hasPermission(_permission: string): boolean {
    // For now, all users have all permissions within their household
    // In the future, implement role-based permissions:
    // - Admin, Member, Viewer roles
    // - Specific permissions like: manage_users, manage_accounts, view_reports, etc.
    return true;
  }

  /**
   * Domain method: Check if user has completed setup
   * User is considered set up if they have a household
   */
  isSetupComplete(): boolean {
    return !!this.householdId;
  }

  /**
   * Domain method: Check if user is household author
   */
  isAuthor(): boolean {
    return this.isHouseholdAuthor;
  }
}
