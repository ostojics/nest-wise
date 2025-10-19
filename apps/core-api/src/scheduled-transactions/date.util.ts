import {formatInTimeZone, toZonedTime, fromZonedTime} from 'date-fns-tz';
import {format, parseISO, getDay, getDate, getDaysInMonth} from 'date-fns';

/**
 * Get the current local date in the specified timezone as a Date object (midnight UTC representation)
 * @param timezone IANA timezone string (e.g., 'Europe/Belgrade')
 * @returns Date object representing midnight of the current local date
 */
export function getTodayInTimezone(timezone: string): Date {
  const now = new Date();
  const localDateString = formatInTimeZone(now, timezone, 'yyyy-MM-dd');
  return parseISO(localDateString);
}

/**
 * Convert a local date string (YYYY-MM-DD) to a Date object
 * @param dateString Local date string in ISO format (YYYY-MM-DD)
 * @returns Date object representing midnight UTC of that date
 */
export function parseLocalDate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Format a Date object as a local date string (YYYY-MM-DD)
 * @param date Date object
 * @returns Local date string in ISO format (YYYY-MM-DD)
 */
export function formatLocalDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get the day of week (0-6, Sunday=0) for a local date in the specified timezone
 * @param localDate Date object representing a local date
 * @param timezone IANA timezone string
 * @returns Day of week (0-6)
 */
export function getDayOfWeekInTimezone(localDate: Date, timezone: string): number {
  const zonedDate = toZonedTime(localDate, timezone);
  return getDay(zonedDate);
}

/**
 * Get the day of month (1-31) for a local date in the specified timezone
 * @param localDate Date object representing a local date
 * @param timezone IANA timezone string
 * @returns Day of month (1-31)
 */
export function getDayOfMonthInTimezone(localDate: Date, timezone: string): number {
  const zonedDate = toZonedTime(localDate, timezone);
  return getDate(zonedDate);
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
 * Create a timestamp for a local date and time in the specified timezone, converted to UTC
 * @param localDateString Local date string (YYYY-MM-DD)
 * @param localTimeString Local time string (HH:MM:SS or HH:MM)
 * @param timezone IANA timezone string
 * @returns Date object in UTC representing the local datetime
 */
export function createTimestampInTimezone(localDateString: string, localTimeString: string, timezone: string): Date {
  // Parse time string to get hours and minutes
  const [hours, minutes] = localTimeString.split(':').map(Number);

  // Create a date string in the format "YYYY-MM-DD HH:MM:SS"
  const dateTimeString = `${localDateString} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

  // Parse this as a zoned time and convert to UTC
  const zonedTime = fromZonedTime(dateTimeString, timezone);
  return zonedTime;
}

/**
 * Check if a local date has already passed in the timezone
 * @param localDate Date object representing a local date
 * @param timezone IANA timezone string
 * @returns True if the local date is in the past
 */
export function isLocalDateInPast(localDate: Date, timezone: string): boolean {
  const today = getTodayInTimezone(timezone);
  return localDate < today;
}

/**
 * Compare two local dates for equality
 * @param date1 First date
 * @param date2 Second date
 * @returns True if dates are the same
 */
export function areLocalDatesEqual(date1: Date, date2: Date): boolean {
  return formatLocalDate(date1) === formatLocalDate(date2);
}
