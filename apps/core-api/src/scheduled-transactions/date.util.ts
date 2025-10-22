import {getDaysInMonth, isBefore} from 'date-fns';

/**
 * Get the current UTC date at midnight
 * @returns Date object representing the start of today in UTC
 */
export function getTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Parse a date string (YYYY-MM-DD) and return a Date at noon UTC
 * @param dateString Date string in ISO format (YYYY-MM-DD)
 * @returns Date object set to noon UTC of that date
 */
export function parseDateAtNoonUTC(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
}

/**
 * Parse a date string (YYYY-MM-DD) and return a Date at midnight UTC
 * @param dateString Date string in ISO format (YYYY-MM-DD)
 * @returns Date object set to midnight UTC of that date
 */
export function parseDateUTC(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Format a Date object as a UTC date string (YYYY-MM-DD)
 * @param date Date object
 * @returns UTC date string in ISO format (YYYY-MM-DD)
 */
export function formatUTCDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the day of week (0-6, Sunday=0) for a UTC date
 * @param date Date object
 * @returns Day of week (0-6)
 */
export function getDayOfWeekUTC(date: Date): number {
  return date.getUTCDay();
}

/**
 * Get the day of month (1-31) for a UTC date
 * @param date Date object
 * @returns Day of month (1-31)
 */
export function getDayOfMonthUTC(date: Date): number {
  return date.getUTCDate();
}

/**
 * Clamp a day-of-month value to the last day of the month if it exceeds
 * @param year Year
 * @param month Month (1-12)
 * @param dayOfMonth Desired day of month (1-31)
 * @returns Clamped day of month
 */
export function clampDayOfMonth(year: number, month: number, dayOfMonth: number): number {
  const testDate = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = getDaysInMonth(testDate);
  return Math.min(dayOfMonth, daysInMonth);
}

/**
 * Check if a UTC date has already passed
 * @param date Date object
 * @returns True if the UTC date is in the past
 */
export function isDateInPast(date: Date): boolean {
  return isBefore(date, getTodayUTC());
}
