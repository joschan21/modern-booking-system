import type { Day } from '@prisma/client'
import { add, addMinutes, getHours, getMinutes, isBefore, isEqual, parse } from 'date-fns'
import { categories, now, OPENING_HOURS_INTERVAL } from 'src/constants/config'

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const selectOptions = categories.map((category) => ({ value: category, label: capitalize(category) }))

export const weekdayIndexToName = (index: number) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[index]
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// function to round a given date up to the nearest half hour
export const roundToNearestMinutes = (date: Date, interval: number) => {
  const minutesLeftUntilNextInterval = interval - (getMinutes(date) % interval)
  return addMinutes(date, minutesLeftUntilNextInterval)
  // Alternatively to ignore seconds (even more precise)
  // return new Date(addMinutes(date, minutesLeftUntilNextInterval).setSeconds(0))
}

/**
 *
 * @param startDate Day we want the opening hours for at midnight
 * @param dbDays Opening hours for the week
 * @returns Array of dates for every opening hour
 */

export const getOpeningTimes = (startDate: Date, dbDays: Day[]) => {
  const dayOfWeek = startDate.getDay()
  const isToday = isEqual(startDate, new Date().setHours(0, 0, 0, 0))

  const today = dbDays.find((d) => d.dayOfWeek === dayOfWeek)
  if (!today) throw new Error('This day does not exist in the database')

  const opening = parse(today.openTime, 'kk:mm', startDate)
  const closing = parse(today.closeTime, 'kk:mm', startDate)

  let hours: number
  let minutes: number

  if (isToday) {
    // Round the current time to the nearest interval. If there are no more bookings today, throw an error
    const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)
    const tooLate = !isBefore(rounded, closing)
    if (tooLate) throw new Error('No more bookings today')

    const isBeforeOpening = isBefore(rounded, opening)

    hours = getHours(isBeforeOpening ? opening : rounded)
    minutes = getMinutes(isBeforeOpening ? opening : rounded)
  } else {
    hours = getHours(opening)
    minutes = getMinutes(opening)
  }

  const beginning = add(startDate, { hours, minutes })
  const end = add(startDate, { hours: getHours(closing), minutes: getMinutes(closing) })
  const interval = OPENING_HOURS_INTERVAL

  // from beginning to end, every interval, generate a date and put that into an array
  const times = []
  for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
    times.push(i)
  }

  return times
}
