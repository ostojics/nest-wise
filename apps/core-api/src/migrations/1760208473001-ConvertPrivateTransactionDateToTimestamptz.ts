import {MigrationInterface, QueryRunner} from 'typeorm';

export class ConvertPrivateTransactionDateToTimestamptz1760208473001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Convert transaction_date from date to timestamptz, setting existing dates to noon UTC
    await queryRunner.query(`
      ALTER TABLE private_transactions
      ALTER COLUMN transaction_date
      TYPE timestamptz
      USING ((transaction_date::timestamp + time '12:00:00') AT TIME ZONE 'UTC');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: convert back to date (loses time-of-day information)
    await queryRunner.query(`
      ALTER TABLE private_transactions
      ALTER COLUMN transaction_date
      TYPE date
      USING (transaction_date::date);
    `);
  }
}
