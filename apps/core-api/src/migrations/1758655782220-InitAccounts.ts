import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitAccounts1758655782220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  household_id uuid NOT NULL,
  name varchar(255) NOT NULL,
  type varchar(50) NOT NULL,
  initial_balance decimal(18,2) NOT NULL DEFAULT 0.0,
  current_balance decimal(18,2) NOT NULL DEFAULT 0.0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT accounts_owner_id_fkey FOREIGN KEY (owner_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT accounts_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE
);`);

    await queryRunner.query(`CREATE INDEX accounts_owner_id_idx ON accounts(owner_id);`);
    await queryRunner.query(`CREATE INDEX accounts_household_id_idx ON accounts(household_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS accounts_household_id_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS accounts_owner_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS accounts;`);
  }
}
