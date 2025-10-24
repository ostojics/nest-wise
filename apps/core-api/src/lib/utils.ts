import {set} from 'date-fns';

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
