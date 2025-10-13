import {useQuery} from '@tanstack/react-query';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {getTransactionsForHousehold} from '@/modules/api/transactions-api';
import {TransactionContract, TransactionType} from '@nest-wise/contracts';
import {getStartAndEndOfWeekIso} from '@/lib/utils';
import {startOfWeek, addDays, format, isFuture, isToday, startOfDay} from 'date-fns';
import {DayData} from '../components/weekly-spending.context';

const DAY_LABELS = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];
const DAY_SHORT_LABELS = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

/**
 * Fetches all transactions for the current week and groups them by day.
 * Paginates through all results using maximum page size.
 */
export const useWeeklyTransactions = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: ['weekly-transactions', me?.householdId],
    queryFn: async () => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');

      const {start, end} = getStartAndEndOfWeekIso();

      // Fetch all transactions for the week by paginating
      const allTransactions: TransactionContract[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await getTransactionsForHousehold(me.householdId, {
          from: start,
          to: end,
          page: currentPage,
          pageSize: 100, // Use maximum page size
          sort: '-transactionDate',
        });

        allTransactions.push(...response.data);

        // Check if we have more pages
        hasMore = response.meta.currentPage < response.meta.totalPages;
        currentPage++;
      }

      // Group transactions by day
      const weekStart = startOfWeek(new Date(), {weekStartsOn: 1});
      const today = startOfDay(new Date());
      const byDay: Record<string, {total: number; transactions: TransactionContract[]}> = {};

      // Initialize all days of the week
      for (let i = 0; i < 7; i++) {
        const dayDate = addDays(weekStart, i);
        const key = format(dayDate, 'yyyy-MM-dd');
        byDay[key] = {total: 0, transactions: []};
      }

      // Group transactions and calculate totals (expenses only)
      allTransactions.forEach((tx) => {
        const txDate = new Date(tx.transactionDate);
        const key = format(txDate, 'yyyy-MM-dd');

        if (byDay[key]) {
          byDay[key].transactions.push(tx);
          // Only count expenses for "spending" total
          if (tx.type === TransactionType.EXPENSE) {
            byDay[key].total += tx.amount;
          }
        }
      });

      // Sort each day's transactions by date descending
      Object.values(byDay).forEach((dayData) => {
        dayData.transactions.sort((a, b) => {
          return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
        });
      });

      // Build days array
      const days: DayData[] = [];
      for (let i = 0; i < 7; i++) {
        const dayDate = addDays(weekStart, i);
        const key = format(dayDate, 'yyyy-MM-dd');
        const dayData = byDay[key];

        if (dayData) {
          days.push({
            key,
            date: dayDate,
            label: DAY_LABELS[i] ?? '',
            shortLabel: DAY_SHORT_LABELS[i] ?? '',
            total: dayData.total,
            transactions: dayData.transactions,
            isFuture: isFuture(dayDate) && !isToday(dayDate),
          });
        }
      }

      // Find today's key for initial selection
      const todayKey = format(today, 'yyyy-MM-dd');
      const initialSelectedDay = days.find((d) => d.key === todayKey)?.key ?? (days[0]?.key || '');

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
