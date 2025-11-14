import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddBudgetAllocations1762000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE budget_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  month varchar(7) NOT NULL,
  salary_amount numeric(14,2) NOT NULL,
  fixed_bills_amount numeric(14,2) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT budget_allocations_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT budget_allocations_household_month_unique UNIQUE (household_id, month),
  CONSTRAINT budget_allocations_salary_amount_check CHECK (salary_amount >= 0),
  CONSTRAINT budget_allocations_fixed_bills_amount_check CHECK (fixed_bills_amount >= 0)
);`);

    await queryRunner.query(`CREATE INDEX budget_allocations_household_id_idx ON budget_allocations(household_id);`);
    await queryRunner.query(`CREATE INDEX budget_allocations_month_idx ON budget_allocations(month);`);

    await queryRunner.query(`CREATE TABLE budget_allocation_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_allocation_id uuid NOT NULL,
  name varchar(100) NOT NULL,
  percentage smallint NOT NULL,
  display_order smallint NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT budget_allocation_categories_budget_allocation_id_fkey FOREIGN KEY (budget_allocation_id)
    REFERENCES budget_allocations(id) ON DELETE CASCADE,
  CONSTRAINT budget_allocation_categories_percentage_check CHECK (percentage BETWEEN 0 AND 100),
  CONSTRAINT budget_allocation_categories_unique UNIQUE (budget_allocation_id, name)
);`);

    await queryRunner.query(
      `CREATE INDEX budget_allocation_categories_budget_allocation_id_idx ON budget_allocation_categories(budget_allocation_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS budget_allocation_categories_budget_allocation_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS budget_allocation_categories;`);
    await queryRunner.query(`DROP INDEX IF EXISTS budget_allocations_month_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS budget_allocations_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS budget_allocations;`);
  }
}
