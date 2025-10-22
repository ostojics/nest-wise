import {startOfDay, setHours, format, getDaysInMonth, isBefore, getDay, getDate} from 'date-fns';
import {UTCDate} from '@date-fns/utc';

/**
 * Get the current UTC date at midnight
 * @returns UTCDate object representing the start of today in UTC
 */
export function getTodayUTC(): Date {
  return startOfDay(new UTCDate());
}

/**
 * Parse a date string (YYYY-MM-DD) and return a Date at noon UTC
 * @param dateString Date string in ISO format (YYYY-MM-DD)
 * @returns Date object set to noon UTC of that date
 */
export function parseDateAtNoonUTC(dateString: string): Date {
  const utcDate = new UTCDate(dateString);
  return setHours(startOfDay(utcDate), 12);
}

/**
 * Parse a date string (YYYY-MM-DD) and return a Date at midnight UTC
 * @param dateString Date string in ISO format (YYYY-MM-DD)
 * @returns Date object set to midnight UTC of that date
 */
export function parseDateUTC(dateString: string): Date {
  return startOfDay(new UTCDate(dateString));
}

/**
 * Format a Date object as a UTC date string (YYYY-MM-DD)
 * @param date Date object
 * @returns UTC date string in ISO format (YYYY-MM-DD)
 */
export function formatUTCDate(date: Date): string {
  return format(new UTCDate(date), 'yyyy-MM-dd');
}

/**
 * Get the day of week (0-6, Sunday=0) for a UTC date
 * @param date Date object
 * @returns Day of week (0-6)
 */
export function getDayOfWeekUTC(date: Date): number {
  return getDay(new UTCDate(date));
}

/**
 * Get the day of month (1-31) for a UTC date
 * @param date Date object
 * @returns Day of month (1-31)
 */
export function getDayOfMonthUTC(date: Date): number {
  return getDate(new UTCDate(date));
}

/**
 * Clamp a day-of-month value to the last day of the month if it exceeds
 * @param year Year
 * @param month Month (1-12)
 * @param dayOfMonth Desired day of month (1-31)
 * @returns Clamped day of month
 */
export function clampDayOfMonth(year: number, month: number, dayOfMonth: number): number {
  const utcDate = new UTCDate(year, month - 1, 1);
  const daysInMonth = getDaysInMonth(utcDate);
  return Math.min(dayOfMonth, daysInMonth);
}

/**
 * Check if a UTC date has already passed
 * @param date Date object
 * @returns True if the UTC date is in the past
 */
export function isDateInPast(date: Date): boolean {
  return isBefore(new UTCDate(date), getTodayUTC());
}
