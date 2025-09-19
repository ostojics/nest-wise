import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Savings} from './savings.entity';
import {SavingsTrendPointContract} from '@nest-wise/contracts';

@Injectable()
export class SavingsRepository {
  constructor(
    @InjectRepository(Savings)
    private readonly savingsRepository: Repository<Savings>,
  ) {}

  async create(savingsData: Partial<Savings>): Promise<Savings> {
    const savings = this.savingsRepository.create(savingsData);
    return await this.savingsRepository.save(savings);
  }

  async getSavingsTrendForHousehold(householdId: string): Promise<SavingsTrendPointContract[]> {
    interface SavingsTrendRow {
      month: string;
      month_short: string;
      amount: string | number | null;
      has_data: boolean;
    }

    const rows: SavingsTrendRow[] = await this.savingsRepository.query(
      `
      WITH params AS (
        SELECT
          (date_trunc('month', CURRENT_DATE) - INTERVAL '11 months')::date AS window_start,
          (date_trunc('month', CURRENT_DATE))::date AS window_start_current_month,
          (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date AS window_end_exclusive
      ),
      months AS (
        SELECT generate_series(
          (SELECT window_start FROM params),
          (SELECT window_start_current_month FROM params),
          INTERVAL '1 month'
        )::date AS month_start
      )
      SELECT
        to_char(m.month_start, 'FMMonth') AS month,
        to_char(m.month_start, 'Mon') AS month_short,
        s.amount::numeric AS amount,
        (s.id IS NOT NULL) AS has_data
      FROM months m
      LEFT JOIN savings s
        ON s.household_id = $1
       AND s.month = to_char(m.month_start, 'Mon')
      ORDER BY m.month_start ASC;
      `,
      [householdId],
    );

    return rows.map((r) => ({
      month: r.month,
      monthShort: r.month_short,
      amount: r.amount === null ? null : Number(r.amount),
      hasData: r.has_data,
    }));
  }
}
