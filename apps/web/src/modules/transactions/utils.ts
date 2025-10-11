import {STANDARD_DATE_FORMAT} from '@/common/constants/dates';
import {format, set} from 'date-fns';

export const formatSelectedDate = (value: Date) => {
  return format(value, STANDARD_DATE_FORMAT);
};

/**
 * Format date for query params using ISO 8601 with time set to noon local time.
 * This ensures correct timezone handling when reading the date back from URL params.
 */
export const formatDateForQueryParam = (value: Date) => {
  const dateAtNoon = set(value, {hours: 12, minutes: 0, seconds: 0, milliseconds: 0});
  return dateAtNoon.toISOString();
};
