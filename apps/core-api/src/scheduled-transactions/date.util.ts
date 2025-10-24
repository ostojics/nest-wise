import {UTCDate} from '@date-fns/utc';
import {startOfDay, setHours, format, getDay, getDate, getDaysInMonth, isBefore} from 'date-fns';

/**
 * Get the current UTC date at midnight (start of day)
 * @returns UTCDate object representing the start of today in UTC
 */
export function getTodayUTC(): Date {
  return startOfDay(new UTCDate());
}

/**
 * Create a UTC date at noon (12:00) from year, month, day
 * @param year Year
 * @param month Month (1-12)
 * @param day Day of month
 * @returns UTCDate object set to noon UTC
 */
export function createDateAtNoonUTC(year: number, month: number, day: number): Date {
  const date = new UTCDate(year, month - 1, day);
  return setHours(date, 12);
}

/**
 * Format a Date object as a UTC date string (YYYY-MM-DD)
 * @param date Date object
 * @returns UTC date string in ISO format (YYYY-MM-DD)
 */
export function formatUTCDate(date: Date): string {
  const utcDate = new UTCDate(date);
  return format(utcDate, 'yyyy-MM-dd');
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
  const testDate = new UTCDate(year, month - 1, 1);
  const daysInMonth = getDaysInMonth(testDate);
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
