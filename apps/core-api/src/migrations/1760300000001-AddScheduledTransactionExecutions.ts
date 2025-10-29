import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddScheduledTransactionExecutions1760300000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create scheduled_transaction_executions table for deduplication
    await queryRunner.query(`CREATE TABLE scheduled_transaction_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL,
  execution_date timestamp with time zone NOT NULL,
  transaction_id uuid NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT scheduled_transaction_executions_rule_id_fkey FOREIGN KEY (rule_id)
    REFERENCES scheduled_transaction_rules(id) ON DELETE CASCADE,
  CONSTRAINT scheduled_transaction_executions_transaction_id_fkey FOREIGN KEY (transaction_id)
    REFERENCES transactions(id) ON DELETE SET NULL,
  CONSTRAINT scheduled_transaction_executions_unique_idx UNIQUE (rule_id, execution_date)
);`);

    // Create index for faster lookups
    await queryRunner.query(
      `CREATE INDEX scheduled_transaction_executions_rule_id_idx ON scheduled_transaction_executions(rule_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS scheduled_transaction_executions_rule_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS scheduled_transaction_executions;`);
  }
}
