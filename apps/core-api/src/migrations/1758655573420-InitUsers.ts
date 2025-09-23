import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitUsers1758655573420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  username varchar(50) NOT NULL UNIQUE,
  email varchar(255) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  is_household_author boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_household_id_fkey FOREIGN KEY (household_id)
    REFERENCES households(id) ON DELETE CASCADE
);`);

    await queryRunner.query(`CREATE INDEX users_household_id_idx ON users(household_id);`);
    await queryRunner.query(`CREATE INDEX users_username_idx ON users(username);`);
    await queryRunner.query(`CREATE INDEX users_email_idx ON users(email);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS users_email_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS users_username_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS users_household_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
