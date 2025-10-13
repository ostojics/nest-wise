import {STANDARD_DATE_FORMAT} from '@/common/constants/dates';
import {dateAtNoon} from '@/lib/utils';
import {format} from 'date-fns';

export const formatSelectedDate = (value: Date) => {
  return format(value, STANDARD_DATE_FORMAT);
};

/**
 * Format date for query params using ISO 8601 with time set to noon local time.
 * This ensures correct timezone handling when reading the date back from URL params.
 */
export const formatDateForQueryParam = (value: Date) => {
  const adjustedDate = dateAtNoon(value);
  return adjustedDate.toISOString();
};
