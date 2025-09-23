import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitCategories1758655819716 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  name varchar(100) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE,
  CONSTRAINT categories_household_name_unique UNIQUE (household_id, name)
);`);

    await queryRunner.query(`CREATE INDEX categories_household_id_idx ON categories(household_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS categories_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
  }
}
