import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitExtensionAndTypes1758655322744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create extension with better error handling for concurrent operations
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // Create enum type with improved concurrent operation handling
    await queryRunner.query(`DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type_enum') THEN
    CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');
  END IF;
END $$;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_enum;`);
  }
}
