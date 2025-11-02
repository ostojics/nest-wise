import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn} from 'typeorm';
import {ScheduledTransactionRule} from './scheduled-transaction-rule.entity';
import {Transaction} from '../transactions/transaction.entity';

@Entity('scheduled_transaction_executions')
@Index(['ruleId', 'executionDate'], {unique: true})
export class ScheduledTransactionExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'rule_id', type: 'uuid'})
  @Index()
  ruleId: string;

  @Column({name: 'execution_date', type: 'timestamptz'})
  executionDate: Date;

  @Column({name: 'transaction_id', type: 'uuid', nullable: true})
  transactionId: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => ScheduledTransactionRule, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'rule_id'})
  rule: ScheduledTransactionRule;

  @ManyToOne(() => Transaction, {onDelete: 'SET NULL', nullable: true})
  @JoinColumn({name: 'transaction_id'})
  transaction: Transaction | null;
}
