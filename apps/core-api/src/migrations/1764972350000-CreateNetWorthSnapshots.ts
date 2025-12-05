import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateNetWorthSnapshots1764972350000 implements MigrationInterface {
  name = 'CreateNetWorthSnapshots1764972350000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "net_worth_snapshots" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "household_id" uuid NOT NULL,
        "year" smallint NOT NULL,
        "month" smallint NOT NULL,
        "total_balance" numeric(14,2) NOT NULL,
        "snapshot_date" TIMESTAMP WITH TIME ZONE NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_net_worth_snapshots" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_net_worth_snapshots_household_period" UNIQUE ("household_id", "year", "month"),
        CONSTRAINT "CHK_net_worth_snapshots_month" CHECK ("month" BETWEEN 1 AND 12),
        CONSTRAINT "CHK_net_worth_snapshots_year" CHECK ("year" >= 2020),
        CONSTRAINT "FK_net_worth_snapshots_household" FOREIGN KEY ("household_id") 
          REFERENCES "households"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_net_worth_snapshots_household_period" 
      ON "net_worth_snapshots" ("household_id", "year", "month")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_net_worth_snapshots_household" 
      ON "net_worth_snapshots" ("household_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_net_worth_snapshots_household"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_net_worth_snapshots_household_period"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "net_worth_snapshots"`);
  }
}
