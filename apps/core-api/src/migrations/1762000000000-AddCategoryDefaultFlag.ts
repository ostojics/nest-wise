import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddCategoryDefaultFlag1762000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE categories ADD COLUMN "default" BOOLEAN NOT NULL DEFAULT FALSE;`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_categories_household_default ON categories (household_id) WHERE ("default" = TRUE);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_categories_household_default;`);
    await queryRunner.query(`ALTER TABLE categories DROP COLUMN "default";`);
  }
}
