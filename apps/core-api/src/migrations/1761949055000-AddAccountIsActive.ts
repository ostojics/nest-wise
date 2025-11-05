import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddAccountIsActive1761949055000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE accounts ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_accounts_household_active ON accounts (household_id, is_active);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_accounts_household_active;`);
    await queryRunner.query(`ALTER TABLE accounts DROP COLUMN is_active;`);
  }
}
