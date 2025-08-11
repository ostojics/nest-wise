import {ColumnSort} from '@tanstack/react-table';
import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {STANDARD_DATE_FORMAT} from '@/common/constants/dates';
import {endOfMonth, format, startOfMonth} from 'date-fns';

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
