import {STANDARD_DATE_FORMAT} from '@/common/constants/dates';
import {format} from 'date-fns';

export const formatSelectedDate = (value: Date) => {
  return format(value, STANDARD_DATE_FORMAT);
};
