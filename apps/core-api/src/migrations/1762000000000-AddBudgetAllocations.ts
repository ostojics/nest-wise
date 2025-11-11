import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddBudgetAllocations1762000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE budget_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  month varchar(7) NOT NULL,
  salary_amount numeric(14,2) NOT NULL,
  fixed_bills_amount numeric(14,2) NOT NULL,
  spending_percentage smallint NOT NULL DEFAULT 25,
  investing_percentage smallint NOT NULL DEFAULT 65,
  giving_percentage smallint NOT NULL DEFAULT 10,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT budget_allocations_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT budget_allocations_household_month_unique UNIQUE (household_id, month),
  CONSTRAINT budget_allocations_salary_amount_check CHECK (salary_amount >= 0),
  CONSTRAINT budget_allocations_fixed_bills_amount_check CHECK (fixed_bills_amount >= 0),
  CONSTRAINT budget_allocations_spending_percentage_check CHECK (spending_percentage BETWEEN 0 AND 100),
  CONSTRAINT budget_allocations_investing_percentage_check CHECK (investing_percentage BETWEEN 0 AND 100),
  CONSTRAINT budget_allocations_giving_percentage_check CHECK (giving_percentage BETWEEN 0 AND 100),
  CONSTRAINT budget_allocations_percentages_sum_check CHECK (spending_percentage + investing_percentage + giving_percentage = 100)
);`);

    await queryRunner.query(`CREATE INDEX budget_allocations_household_id_idx ON budget_allocations(household_id);`);
    await queryRunner.query(`CREATE INDEX budget_allocations_month_idx ON budget_allocations(month);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS budget_allocations_month_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS budget_allocations_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS budget_allocations;`);
  }
}
