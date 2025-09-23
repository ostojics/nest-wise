import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitLicensesAndHouseholds1758655441347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  used_at timestamp with time zone NULL,
  note text NULL
);`);

    await queryRunner.query(`CREATE TABLE households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  currency_code char(3) NOT NULL DEFAULT 'USD',
  monthly_budget decimal(18,2) NOT NULL DEFAULT 5000,
  license_id uuid NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT households_license_id_fkey FOREIGN KEY (license_id)
    REFERENCES licenses(id) ON DELETE RESTRICT
);`);

    await queryRunner.query(`CREATE INDEX households_license_id_idx ON households(license_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS households_license_id_idx;`);
    await queryRunner.query(`DROP TABLE IF EXISTS households;`);
    await queryRunner.query(`DROP TABLE IF EXISTS licenses;`);
  }
}
