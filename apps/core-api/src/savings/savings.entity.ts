import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn} from 'typeorm';
import {Household} from 'src/households/household.entity';

@Entity('savings')
@Index(['householdId', 'periodYm'], {unique: true})
export class Savings {
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
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
  })
  month: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'period_ym',
  })
  @Index()
  periodYm: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => Household, (household: Household): Household['savings'] => household.savings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'household_id'})
  household: Household;
}
