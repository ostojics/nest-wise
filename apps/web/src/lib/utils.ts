import {ColumnSort} from '@tanstack/react-table';
import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {STANDARD_DATE_FORMAT} from '@/common/constants/dates';
import {endOfMonth, format, startOfMonth, add, sub, set} from 'date-fns';
import {PUBLIC_PAGES} from '@/common/constants/public-pages';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const serializeSortOption = (value: ColumnSort) => {
  const prefix = value.desc ? '-' : '';

  return `${prefix}${value.id}`;
};

export const deserializeSortOption = (value: string): ColumnSort => {
  const desc = value.startsWith('-');
  const id = desc ? value.slice(1) : value;
  const direction = desc ? 'desc' : 'asc';

  return {id, desc: direction === 'desc'};
};

export const getStartAndEndOfMonth = (): {start: string; end: string} => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  return {
    start: format(start, STANDARD_DATE_FORMAT),
    end: format(end, STANDARD_DATE_FORMAT),
  };
};

/**
 * Computes a boundary reference date to drive calendar "disabled" ranges.
 *
 * - When `disableBefore` is true, returns one day before the provided `date`.
 * - When `disableBefore` is false, returns one day after the provided `date`.
 *
 * This ensures the boundary date itself remains selectable when used with
 * calendar constraints like `{ before: Date }` or `{ after: Date }`.
 *
 * @param date The boundary date to offset by one day.
 * @param disableBefore Whether the intent is to disable dates before (`true`) or after (`false`) the boundary.
 * @returns The computed reference date (offset by one day) or `undefined`.
 */
export const getDateDisableReference = (date: Date, disableBefore: boolean) => {
  if (disableBefore) return sub(date, {days: 1});
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!disableBefore) return add(date, {days: 1});

  return undefined;
};

export const generateRandomHsl = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(60 + Math.random() * 41);
  const lightness = Math.floor(35 + Math.random() * 31);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const isPublicRoute = (path: string) => {
  return PUBLIC_PAGES.some((page) => path.startsWith(page));
};

/**
 * Returns a new Date object set to noon (12:00:00.000) of the provided date.
 *
 * @param date - The original Date object to adjust.
 * @returns A new Date object with the time set to 12:00 PM (noon) on the same day as the input date.
 */
export const dateAtNoon = (date: Date) => {
  const dateAtNoon = set(date, {hours: 12, minutes: 0, seconds: 0, milliseconds: 0});
  return dateAtNoon;
};

/**
 * Returns start and end of current month as ISO 8601 timestamps at noon local time.
 * This ensures correct timezone handling for date range queries.
 *
 * @returns Object with start and end ISO timestamp strings
 */
export const getStartAndEndOfMonthIso = (): {start: string; end: string} => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  return {
    start: dateAtNoon(start).toISOString(),
    end: dateAtNoon(end).toISOString(),
  };
};

/**
 * Generates a string key representing the given date in 'yyyy-MM-dd' format.
 *
 * @param date - The date object to format.
 * @returns A string key in 'yyyy-MM-dd' format for the provided date.
 */
export const getWeeklyOverviewKey = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Returns a formatted display name for an account, including the account type label in parentheses.
 *
 * @param options - The options object
 * @param options.accountId - The ID of the account to format
 * @param options.accounts - Array of account objects to search through
 * @param options.accountTypes - Array of account type definitions with labels
 * @returns Formatted string in the format "Account Name (Type Label)" or empty string if account not found
 *
 * @example
 * ```ts
 * const displayName = getAccountDisplayName({
 *   accountId: 'abc-123',
 *   accounts: [{id: 'abc-123', name: 'My Checking', type: 'checking'}],
 *   accountTypes: [{value: 'checking', label: 'Tekući račun'}]
 * });
 * // Returns: "My Checking (Tekući račun)"
 * ```
 */
export const getAccountDisplayName = ({
  accountId,
  accounts,
  accountTypes,
}: {
  accountId: string;
  accounts?: Array<{id: string; name: string; type: string}>;
  accountTypes: ReadonlyArray<{value: string; label: string}>;
}): string => {
  const account = accounts?.find((acc) => acc.id === accountId);
  if (!account) return '';

  const accountType = accountTypes.find((type) => type.value === account.type);
  return `${account.name} (${accountType?.label ?? account.type})`;
};
