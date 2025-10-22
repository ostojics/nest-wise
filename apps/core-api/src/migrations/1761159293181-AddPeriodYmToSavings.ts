import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddPeriodYmToSavings1761159293181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add period_ym column (nullable initially for backfill)
    await queryRunner.query(`ALTER TABLE savings ADD COLUMN period_ym varchar(7) NULL;`);

    // Backfill existing rows with a derived period_ym based on created_at
    // This is a best-effort backfill - for existing rows, we derive YYYY-MM from created_at
    await queryRunner.query(`
      UPDATE savings
      SET period_ym = to_char(created_at, 'YYYY-MM')
      WHERE period_ym IS NULL;
    `);

    // Now make the column NOT NULL
    await queryRunner.query(`ALTER TABLE savings ALTER COLUMN period_ym SET NOT NULL;`);

    // Drop the old unique constraint on (household_id, month)
    await queryRunner.query(`ALTER TABLE savings DROP CONSTRAINT IF EXISTS savings_household_month_unique;`);

    // Add new unique constraint on (household_id, period_ym)
    await queryRunner.query(
      `ALTER TABLE savings ADD CONSTRAINT savings_household_period_ym_unique UNIQUE (household_id, period_ym);`,
    );

    // Add index on period_ym for queries
    await queryRunner.query(`CREATE INDEX savings_period_ym_idx ON savings(period_ym);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX IF EXISTS savings_period_ym_idx;`);

    // Drop new unique constraint
    await queryRunner.query(`ALTER TABLE savings DROP CONSTRAINT IF EXISTS savings_household_period_ym_unique;`);

    // Restore old unique constraint
    await queryRunner.query(
      `ALTER TABLE savings ADD CONSTRAINT savings_household_month_unique UNIQUE (household_id, month);`,
    );

    // Drop period_ym column
    await queryRunner.query(`ALTER TABLE savings DROP COLUMN IF EXISTS period_ym;`);
  }
}
