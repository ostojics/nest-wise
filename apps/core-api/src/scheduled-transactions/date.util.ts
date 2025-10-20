import {parseISO, getDaysInMonth} from 'date-fns';

/**
 * Get the current UTC date at noon as a Date object
 * @returns Date object representing noon UTC of the current date
 */
export function getTodayAtNoonUTC(): Date {
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0, 0));
  return utcDate;
}

/**
 * Get the current UTC date (midnight)
 * @returns Date object representing midnight UTC of the current date
 */
export function getTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Convert a date string (YYYY-MM-DD) to a Date object at noon UTC
 * @param dateString Date string in ISO format (YYYY-MM-DD)
 * @returns Date object representing noon UTC of that date
 */
export function parseDateAtNoonUTC(dateString: string): Date {
  const parsed = parseISO(dateString);
  return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 12, 0, 0, 0));
}

/**
 * Convert a date string (YYYY-MM-DD) to a Date object at midnight UTC
 * @param dateString Date string in ISO format (YYYY-MM-DD)
 * @returns Date object representing midnight UTC of that date
 */
export function parseDateUTC(dateString: string): Date {
  const parsed = parseISO(dateString);
  return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0));
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
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  return Math.min(dayOfMonth, daysInMonth);
}

/**
 * Check if a UTC date has already passed
 * @param date Date object
 * @returns True if the UTC date is in the past
 */
export function isDateInPast(date: Date): boolean {
  const today = getTodayUTC();
  return date < today;
}
