import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddScheduledFieldsToTransactions1760300000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add scheduled_rule_id column
    await queryRunner.query(`ALTER TABLE transactions
      ADD COLUMN scheduled_rule_id uuid NULL;`);

    // Add scheduled_local_date column
    await queryRunner.query(`ALTER TABLE transactions
      ADD COLUMN scheduled_local_date date NULL;`);

    // Add foreign key constraint
    await queryRunner.query(`ALTER TABLE transactions
      ADD CONSTRAINT transactions_scheduled_rule_id_fkey FOREIGN KEY (scheduled_rule_id)
        REFERENCES scheduled_transaction_rules(id) ON DELETE SET NULL;`);

    // Add unique partial index
    await queryRunner.query(`CREATE UNIQUE INDEX transactions_scheduled_rule_local_date_unique_idx
      ON transactions(scheduled_rule_id, scheduled_local_date)
      WHERE scheduled_rule_id IS NOT NULL;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS transactions_scheduled_rule_local_date_unique_idx;`);
    await queryRunner.query(`ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_scheduled_rule_id_fkey;`);
    await queryRunner.query(`ALTER TABLE transactions DROP COLUMN IF EXISTS scheduled_local_date;`);
    await queryRunner.query(`ALTER TABLE transactions DROP COLUMN IF EXISTS scheduled_rule_id;`);
  }
}
