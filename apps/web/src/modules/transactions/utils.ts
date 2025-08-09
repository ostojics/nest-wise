import {format} from 'date-fns';

export const formatSelectedDate = (value: Date) => {
  return format(value, 'yyyy-MM-dd');
};
