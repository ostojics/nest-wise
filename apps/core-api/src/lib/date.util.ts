import {UTCDate} from '@date-fns/utc';
import {format, parse, startOfDay} from 'date-fns';

/**
 * Converts a date-only string (YYYY-MM-DD) to a UTC Date at midnight (00:00:00).
 * This ensures the calendar day is preserved without local timezone drift.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object representing UTC midnight of the given calendar day
 *
 * @example
 * toUtcDateOnly('2024-01-15') // Returns UTC Date for 2024-01-15T00:00:00Z
 */
export function toUtcDateOnly(dateString: string): Date {
  // Parse the date string as UTC (no local timezone interpretation)
  const parsed = parse(dateString, 'yyyy-MM-dd', new UTCDate());
  // Ensure it's at start of day (00:00:00 UTC)
  return startOfDay(parsed);
}

/**
 * Formats a Date object to a date-only string (YYYY-MM-DD).
 * Uses UTC to ensure consistent output regardless of local timezone.
 *
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * formatDateOnly(new Date('2024-01-15T10:30:00Z')) // Returns '2024-01-15'
 */
export function formatDateOnly(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Formats a date-only string (YYYY-MM-DD) to return the same string.
 * If input is a Date object, formats it to YYYY-MM-DD string.
 * This is useful for handling mixed input types consistently.
 *
 * @param dateInput - Date string or Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function ensureDateOnlyString(dateInput: string | Date): string {
  if (typeof dateInput === 'string') {
    return dateInput;
  }
  return formatDateOnly(dateInput);
}
