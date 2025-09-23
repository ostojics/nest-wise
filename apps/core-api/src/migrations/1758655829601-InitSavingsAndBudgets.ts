import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitSavingsAndBudgets1758655829601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

    await queryRunner.query(`CREATE TABLE category_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  category_id uuid NOT NULL,
  month varchar(7) NOT NULL,
  planned_amount decimal(18,2) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT category_budgets_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT category_budgets_category_id_fkey FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE CASCADE,
  CONSTRAINT category_budgets_unique UNIQUE (household_id, category_id, month)
);`);

    await queryRunner.query(`CREATE INDEX category_budgets_household_id_idx ON category_budgets(household_id);`);
    await queryRunner.query(`CREATE INDEX category_budgets_category_id_idx ON category_budgets(category_id);`);
    await queryRunner.query(`CREATE INDEX category_budgets_month_idx ON category_budgets(month);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS category_budgets_month_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS category_budgets_category_id_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS category_budgets_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS category_budgets;`);
    await queryRunner.query(`DROP INDEX IF EXISTS savings_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS savings;`);
  }
}
