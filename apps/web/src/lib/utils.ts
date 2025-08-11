import {ColumnSort} from '@tanstack/react-table';
import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

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
