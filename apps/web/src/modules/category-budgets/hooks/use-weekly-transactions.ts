import {useQuery} from '@tanstack/react-query';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {getTransactionsForHousehold} from '@/modules/api/transactions-api';
import {TransactionContract} from '@nest-wise/contracts';
import {dateAtNoon, getWeeklyOverviewKey} from '@/lib/utils';
import {addDays, startOfDay} from 'date-fns';
import {DayData} from '@/modules/plan/weekly-spending-overview/hooks/use-selected-day-data';

const DAY_LABELS = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];
const DAY_SHORT_LABELS = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

interface UseWeeklyTransactionsArgs {
  weekStart: Date;
  weekEnd: Date;
}

/**
 * Fetches all transactions for the specified week and groups them by day.
 * Paginates through all results using maximum page size.
 */
export const useWeeklyTransactions = ({weekStart, weekEnd}: UseWeeklyTransactionsArgs) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: ['weekly-transactions', me?.householdId, weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: async () => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');

      const start = dateAtNoon(weekStart).toISOString();
      const end = dateAtNoon(weekEnd).toISOString();
      const allTransactions: TransactionContract[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await getTransactionsForHousehold(me.householdId, {
          from: start,
          to: end,
          type: 'expense',
          page: currentPage,
          pageSize: 100, // Use maximum page size
          sort: '-transactionDate',
        });

        allTransactions.push(...response.data);

        hasMore = response.meta.currentPage < response.meta.totalPages;
        currentPage++;
      }

      const today = startOfDay(new Date());
      const byDay: Record<string, {total: number; transactions: TransactionContract[]}> = {};

      for (let i = 0; i < 7; i++) {
        const dayDate = addDays(weekStart, i);
        const key = getWeeklyOverviewKey(dayDate);
        byDay[key] = {total: 0, transactions: []};
      }

      // Group transactions and calculate totals
      allTransactions.forEach((tx) => {
        const txDate = new Date(tx.transactionDate);
        const key = getWeeklyOverviewKey(txDate);

        if (byDay[key]) {
          byDay[key].transactions.push(tx);
          byDay[key].total += Number(tx.amount);
        }
      });

      const days: DayData[] = [];
      for (let i = 0; i < 7; i++) {
        const dayDate = addDays(weekStart, i);
        const key = getWeeklyOverviewKey(dayDate);
        const dayData = byDay[key];

        if (dayData) {
          days.push({
            key,
            date: dayDate,
            label: DAY_LABELS[i] ?? '',
            shortLabel: DAY_SHORT_LABELS[i] ?? '',
            total: dayData.total,
            transactions: dayData.transactions,
          });
        }
      }

      const todayKey = getWeeklyOverviewKey(today);
      const initialSelectedDay = days.find((d) => d.key === todayKey)?.key ?? days[0]?.key ?? '';

      return {
        days,
        byDay,
        initialSelectedDay,
      };
    },
    enabled: Boolean(me?.householdId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
