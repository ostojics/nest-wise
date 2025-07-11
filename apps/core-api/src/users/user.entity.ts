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
}
