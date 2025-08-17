import {ColumnSort} from '@tanstack/react-table';
import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {STANDARD_DATE_FORMAT} from '@/common/constants/dates';
import {endOfMonth, format, startOfMonth, add, sub} from 'date-fns';

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
