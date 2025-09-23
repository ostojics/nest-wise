import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitPrivateTransactions1758655853118 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE private_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  account_id uuid NOT NULL,
  user_id uuid NOT NULL,
  amount decimal(18,2) NOT NULL,
  type transaction_type_enum NOT NULL,
  description text NULL,
  transaction_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT private_transactions_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT private_transactions_account_id_fkey FOREIGN KEY (account_id)
    REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT private_transactions_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);`);

    await queryRunner.query(
      `CREATE INDEX private_transactions_household_id_idx ON private_transactions(household_id);`,
    );
    await queryRunner.query(`CREATE INDEX private_transactions_account_id_idx ON private_transactions(account_id);`);
    await queryRunner.query(`CREATE INDEX private_transactions_user_id_idx ON private_transactions(user_id);`);
    await queryRunner.query(
      `CREATE INDEX private_transactions_transaction_date_idx ON private_transactions(transaction_date);`,
    );

    await queryRunner.query(
      `CREATE INDEX private_transactions_description_fts_idx ON private_transactions USING GIN (to_tsvector('simple', coalesce(description, '')));`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS private_transactions_description_fts_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS private_transactions_transaction_date_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS private_transactions_user_id_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS private_transactions_account_id_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS private_transactions_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS private_transactions;`);
  }
}
