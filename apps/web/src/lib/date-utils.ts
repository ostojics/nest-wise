import {UTCDate} from '@date-fns/utc';
import {format, parse, startOfDay} from 'date-fns';

/**
 * Parses a date-only string (YYYY-MM-DD) and returns a UTC Date at midnight.
 * This ensures the calendar day is preserved without local timezone drift.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object representing UTC midnight of the given calendar day
 *
 * @example
 * parseUtcDateOnly('2024-01-15') // Returns UTC Date for 2024-01-15T00:00:00Z
 */
export function parseUtcDateOnly(dateString: string): Date {
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
 * Formats a UTC date to a localized date string for display.
 * The date is treated as UTC to avoid timezone shifts.
 *
 * @param dateString - Date string in YYYY-MM-DD format (from API)
 * @param formatString - Format string for date-fns (default: 'dd.MM.yyyy.')
 * @returns Formatted date string
 *
 * @example
 * formatUtcDateForDisplay('2024-01-15') // Returns '15.01.2024.'
 * formatUtcDateForDisplay('2024-01-15', 'PP') // Returns formatted as per locale
 */
export function formatUtcDateForDisplay(dateString: string, formatString = 'dd.MM.yyyy.'): string {
  const utcDate = parseUtcDateOnly(dateString);
  return format(utcDate, formatString);
}

/**
 * Creates a UTC Date from year, month, and day without timezone offset.
 *
 * @param year - Full year (e.g., 2024)
 * @param month - Month (1-12, NOT 0-11)
 * @param day - Day of month
 * @returns UTC Date at midnight
 *
 * @example
 * createUtcDate(2024, 1, 15) // Returns UTC Date for 2024-01-15T00:00:00Z
 */
export function createUtcDate(year: number, month: number, day: number): Date {
  return new UTCDate(year, month - 1, day);
}
