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
