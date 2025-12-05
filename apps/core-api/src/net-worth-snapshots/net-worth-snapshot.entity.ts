import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Unique} from 'typeorm';
import {Household} from '../households/household.entity';

@Entity('net_worth_snapshots')
@Unique(['householdId', 'year', 'month'])
@Index(['householdId', 'year', 'month'])
@Index(['householdId'])
export class NetWorthSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'household_id', type: 'uuid'})
  householdId: string;

  @ManyToOne(() => Household, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'household_id'})
  household: Household;

  @Column({type: 'smallint'})
  year: number;

  @Column({type: 'smallint'})
  month: number;

  @Column({name: 'total_balance', type: 'decimal', precision: 14, scale: 2})
  totalBalance: number;

  @Column({name: 'snapshot_date', type: 'timestamp with time zone'})
  snapshotDate: Date;

  @CreateDateColumn({name: 'created_at', type: 'timestamp with time zone'})
  createdAt: Date;
}
