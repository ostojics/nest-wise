import {TZDate} from '@date-fns/tz';
import {endOfMonth, format, startOfMonth, subMonths} from 'date-fns';

/**
 * Get the previous month boundaries in the specified timezone.
 * Returns start and end of the previous month in local time.
 *
 * @param timezone - IANA timezone identifier (e.g., 'Europe/Belgrade')
 * @returns Object with previousMonthStart, previousMonthEnd as Date objects in UTC, and periodYm as YYYY-MM
 */
export function getPreviousMonthBoundaries(timezone: string): {
  previousMonthStart: Date;
  previousMonthEnd: Date;
  periodYm: string;
} {
  // Get current date in the specified timezone
  const nowInTz = new TZDate(new Date(), timezone);

  // Get previous month in the specified timezone
  const prevMonthInTz = subMonths(nowInTz, 1);

  // Get start and end of previous month in the specified timezone
  const prevMonthStartInTz = startOfMonth(prevMonthInTz);
  const prevMonthEndInTz = endOfMonth(prevMonthInTz);

  // Format period_ym as YYYY-MM
  const periodYm = format(prevMonthStartInTz, 'yyyy-MM');

  // Return dates as Date objects (they will be in UTC when converted to ISO strings)
  return {
    previousMonthStart: prevMonthStartInTz,
    previousMonthEnd: prevMonthEndInTz,
    periodYm,
  };
}

/**
 * Format a date to YYYY-MM-DD in the specified timezone.
 * This ensures that date filtering uses the correct local date.
 *
 * @param date - Date to format
 * @param timezone - IANA timezone identifier
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDateInTimezone(date: Date, timezone: string): string {
  // Create a TZDate from the input date in the specified timezone
  const dateInTz = new TZDate(date, timezone);
  return format(dateInTz, 'yyyy-MM-dd');
}
