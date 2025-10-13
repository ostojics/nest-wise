import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitExtensionAndTypes1758655322744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await queryRunner.query(`DO $$ BEGIN
  CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_enum;`);
  }
}
