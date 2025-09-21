import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne} from 'typeorm';
import {Household} from 'src/households/household.entity';

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true,
    default: () => 'gen_random_uuid()',
  })
  key: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'expires_at',
  })
  expiresAt: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    name: 'used_at',
  })
  usedAt: Date | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string | null;

  @OneToOne(() => Household, (household) => household.license)
  household: Household;
}
