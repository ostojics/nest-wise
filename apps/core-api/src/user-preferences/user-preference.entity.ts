import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {User} from 'src/users/user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true,
    name: 'user_id',
  })
  @Index()
  userId: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'automatic_logout',
  })
  automaticLogout: boolean;

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

  @OneToOne(() => User, (user) => user.userPreference, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'user_id'})
  user: User;
}
