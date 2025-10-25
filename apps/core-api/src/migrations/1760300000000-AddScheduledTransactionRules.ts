import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddScheduledTransactionRules1760300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types for frequency and status
    await queryRunner.query(`CREATE TYPE scheduled_transaction_frequency_type_enum AS ENUM ('weekly', 'monthly');`);
    await queryRunner.query(`CREATE TYPE scheduled_transaction_status_enum AS ENUM ('active', 'paused');`);

    // Create the scheduled_transaction_rules table
    await queryRunner.query(`CREATE TABLE scheduled_transaction_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  created_by uuid NOT NULL,
  account_id uuid NOT NULL,
  category_id uuid NULL,
  type transaction_type_enum NOT NULL,
  amount decimal(14,2) NOT NULL,
  description varchar(256) NULL,
  frequency_type scheduled_transaction_frequency_type_enum NOT NULL,
  day_of_week smallint NULL,
  day_of_month smallint NULL,
  start_date timestamp with time zone NOT NULL,
  status scheduled_transaction_status_enum NOT NULL DEFAULT 'active',
  last_run_date timestamp with time zone NULL,
  failure_count int NOT NULL DEFAULT 0,
  last_error text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT scheduled_transaction_rules_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT scheduled_transaction_rules_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT scheduled_transaction_rules_account_id_fkey FOREIGN KEY (account_id)
    REFERENCES accounts(id) ON DELETE RESTRICT,
  CONSTRAINT scheduled_transaction_rules_category_id_fkey FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT scheduled_transaction_rules_day_of_week_check CHECK (day_of_week BETWEEN 0 AND 6 OR day_of_week IS NULL),
  CONSTRAINT scheduled_transaction_rules_day_of_month_check CHECK (day_of_month BETWEEN 1 AND 31 OR day_of_month IS NULL)
);`);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX scheduled_transaction_rules_household_id_idx ON scheduled_transaction_rules(household_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX scheduled_transaction_rules_account_id_idx ON scheduled_transaction_rules(account_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX scheduled_transaction_rules_status_start_date_idx ON scheduled_transaction_rules(status, start_date);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS scheduled_transaction_rules_status_start_date_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS scheduled_transaction_rules_account_id_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS scheduled_transaction_rules_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS scheduled_transaction_rules;`);
    await queryRunner.query(`DROP TYPE IF EXISTS scheduled_transaction_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS scheduled_transaction_frequency_type_enum;`);
  }
}
