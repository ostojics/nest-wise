import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitTransactions1758655840340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  account_id uuid NOT NULL,
  category_id uuid NULL,
  amount decimal(18,2) NOT NULL,
  type transaction_type_enum NOT NULL,
  description text NULL,
  transaction_date date NOT NULL,
  is_reconciled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transactions_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id)
    REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE SET NULL
);`);

    await queryRunner.query(`CREATE INDEX transactions_household_id_idx ON transactions(household_id);`);
    await queryRunner.query(`CREATE INDEX transactions_account_id_idx ON transactions(account_id);`);
    await queryRunner.query(`CREATE INDEX transactions_category_id_idx ON transactions(category_id);`);
    await queryRunner.query(`CREATE INDEX transactions_transaction_date_idx ON transactions(transaction_date);`);
    await queryRunner.query(
      `CREATE INDEX transactions_description_fts_idx ON transactions USING GIN (to_tsvector('simple', coalesce(description, '')));`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS transactions_description_fts_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS transactions_transaction_date_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS transactions_category_id_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS transactions_account_id_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS transactions_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS transactions;`);
  }
}
