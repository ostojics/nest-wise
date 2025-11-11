import {MigrationInterface, QueryRunner} from 'typeorm';

export class RefactorBudgetAllocationsToSupportDynamicCategories1762000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the new budget_allocation_categories table
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

    // Migrate existing data from budget_allocations to budget_allocation_categories
    await queryRunner.query(`
      INSERT INTO budget_allocation_categories (budget_allocation_id, name, percentage, display_order)
      SELECT 
        id,
        'Potrošnja',
        spending_percentage,
        0
      FROM budget_allocations
      WHERE spending_percentage > 0;
    `);

    await queryRunner.query(`
      INSERT INTO budget_allocation_categories (budget_allocation_id, name, percentage, display_order)
      SELECT 
        id,
        'Investicije',
        investing_percentage,
        1
      FROM budget_allocations
      WHERE investing_percentage > 0;
    `);

    await queryRunner.query(`
      INSERT INTO budget_allocation_categories (budget_allocation_id, name, percentage, display_order)
      SELECT 
        id,
        'Davanje',
        giving_percentage,
        2
      FROM budget_allocations
      WHERE giving_percentage > 0;
    `);

    // Drop the old percentage columns and their constraints from budget_allocations
    await queryRunner.query(
      `ALTER TABLE budget_allocations DROP CONSTRAINT IF EXISTS budget_allocations_percentages_sum_check;`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations DROP CONSTRAINT IF EXISTS budget_allocations_spending_percentage_check;`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations DROP CONSTRAINT IF EXISTS budget_allocations_investing_percentage_check;`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations DROP CONSTRAINT IF EXISTS budget_allocations_giving_percentage_check;`,
    );

    await queryRunner.query(`ALTER TABLE budget_allocations DROP COLUMN spending_percentage;`);
    await queryRunner.query(`ALTER TABLE budget_allocations DROP COLUMN investing_percentage;`);
    await queryRunner.query(`ALTER TABLE budget_allocations DROP COLUMN giving_percentage;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the percentage columns
    await queryRunner.query(
      `ALTER TABLE budget_allocations ADD COLUMN spending_percentage smallint NOT NULL DEFAULT 25;`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations ADD COLUMN investing_percentage smallint NOT NULL DEFAULT 65;`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations ADD COLUMN giving_percentage smallint NOT NULL DEFAULT 10;`,
    );

    // Migrate data back from categories to columns (using first 3 categories ordered by display_order)
    await queryRunner.query(`
      UPDATE budget_allocations ba
      SET spending_percentage = COALESCE((
        SELECT percentage FROM budget_allocation_categories 
        WHERE budget_allocation_id = ba.id 
        ORDER BY display_order 
        LIMIT 1
      ), 25);
    `);

    await queryRunner.query(`
      UPDATE budget_allocations ba
      SET investing_percentage = COALESCE((
        SELECT percentage FROM budget_allocation_categories 
        WHERE budget_allocation_id = ba.id 
        ORDER BY display_order 
        OFFSET 1 LIMIT 1
      ), 65);
    `);

    await queryRunner.query(`
      UPDATE budget_allocations ba
      SET giving_percentage = COALESCE((
        SELECT percentage FROM budget_allocation_categories 
        WHERE budget_allocation_id = ba.id 
        ORDER BY display_order 
        OFFSET 2 LIMIT 1
      ), 10);
    `);

    // Add back the constraints
    await queryRunner.query(
      `ALTER TABLE budget_allocations ADD CONSTRAINT budget_allocations_spending_percentage_check CHECK (spending_percentage BETWEEN 0 AND 100);`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations ADD CONSTRAINT budget_allocations_investing_percentage_check CHECK (investing_percentage BETWEEN 0 AND 100);`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations ADD CONSTRAINT budget_allocations_giving_percentage_check CHECK (giving_percentage BETWEEN 0 AND 100);`,
    );
    await queryRunner.query(
      `ALTER TABLE budget_allocations ADD CONSTRAINT budget_allocations_percentages_sum_check CHECK (spending_percentage + investing_percentage + giving_percentage = 100);`,
    );

    // Drop the categories table
    await queryRunner.query(`DROP INDEX IF EXISTS budget_allocation_categories_budget_allocation_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS budget_allocation_categories;`);
  }
}
