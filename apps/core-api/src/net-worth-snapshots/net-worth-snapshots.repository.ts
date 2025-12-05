import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {NetWorthSnapshot} from './net-worth-snapshot.entity';

@Injectable()
export class NetWorthSnapshotsRepository {
  constructor(
    @InjectRepository(NetWorthSnapshot)
    private readonly snapshotRepository: Repository<NetWorthSnapshot>,
  ) {}

  async findByHousehold(householdId: string, limit: number): Promise<NetWorthSnapshot[]> {
    return await this.snapshotRepository.find({
      where: {householdId},
      order: {
        year: 'DESC',
        month: 'DESC',
      },
      take: limit,
    });
  }

  async upsert(snapshot: Partial<NetWorthSnapshot>): Promise<void> {
    await this.snapshotRepository.upsert(snapshot, {
      conflictPaths: ['householdId', 'year', 'month'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  async getCurrentTotalBalance(householdId: string): Promise<number> {
    interface QueryResult {
      total: string | number | null;
    }

    const result = await this.snapshotRepository.query<QueryResult[]>(
      `
      SELECT COALESCE(SUM(current_balance), 0)::numeric AS total
      FROM accounts
      WHERE household_id = $1 AND is_active = true
      `,
      [householdId],
    );

    return result[0]?.total ? Number(result[0].total) : 0;
  }
}
