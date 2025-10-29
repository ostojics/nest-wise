import {MigrationInterface, QueryRunner} from 'typeorm';

export class DropSavings1761000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.query(`DROP INDEX IF EXISTS savings_household_id_idx;`);
    // Drop constraints explicitly before dropping the table
    await queryRunner.query(`ALTER TABLE IF EXISTS savings DROP CONSTRAINT IF EXISTS savings_household_id_fkey;`);
    await queryRunner.query(`ALTER TABLE IF EXISTS savings DROP CONSTRAINT IF EXISTS savings_household_month_unique;`);
    // Finally drop the table
    await queryRunner.query(`DROP TABLE IF EXISTS savings;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  amount decimal(18,2) NOT NULL,
  month varchar(7) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT savings_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT savings_household_month_unique UNIQUE (household_id, month)
);`);

    await queryRunner.query(`CREATE INDEX savings_household_id_idx ON savings(household_id);`);
  }
}
