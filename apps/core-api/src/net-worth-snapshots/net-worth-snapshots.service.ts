import {Injectable} from '@nestjs/common';
import {NetWorthSnapshotsRepository} from './net-worth-snapshots.repository';
import {NetWorthTrendPointContract} from '@nest-wise/contracts';
import {getYear, getMonth, subMonths, format} from 'date-fns';

@Injectable()
export class NetWorthSnapshotsService {
  constructor(private readonly snapshotsRepository: NetWorthSnapshotsRepository) {}

  async getNetWorthTrend(householdId: string): Promise<NetWorthTrendPointContract[]> {
    const now = new Date();
    const currentYear = getYear(now);
    const currentMonth = getMonth(now) + 1; // date-fns months are 0-indexed

    // Get last 11 months of snapshots
    const snapshots = await this.snapshotsRepository.findByHousehold(householdId, 11);

    // Get current month's live balance
    const currentBalance = await this.snapshotsRepository.getCurrentTotalBalance(householdId);

    // Build 12-month array
    const result: NetWorthTrendPointContract[] = [];

    for (let i = 11; i >= 0; i--) {
      const targetDate = subMonths(now, i);
      const year = getYear(targetDate);
      const month = getMonth(targetDate) + 1;

      const isCurrentMonth = year === currentYear && month === currentMonth;

      if (isCurrentMonth) {
        result.push({
          month: format(targetDate, 'MMMM'),
          monthShort: format(targetDate, 'MMM'),
          amount: currentBalance,
          hasData: true,
        });
      } else {
        const snapshot = snapshots.find((s) => s.year === year && s.month === month);
        result.push({
          month: format(targetDate, 'MMMM'),
          monthShort: format(targetDate, 'MMM'),
          amount: snapshot ? Number(snapshot.totalBalance) : null,
          hasData: !!snapshot,
        });
      }
    }

    return result;
  }
}
