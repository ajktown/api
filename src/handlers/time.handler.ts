import { DateTime } from 'luxon'

// This is the JS approved date type that should be acceptable
type JsDateAccepter = number | string | Date
const DAY_IN_MS = 24 * 60 * 60 * 1000

export const timeHandler = {
  getStartOfToday: (timezone: string): Date => {
    return DateTime.now().setZone(timezone).startOf('day').toJSDate()
  },
  getStartOfYesterday: (timezone: string): Date => {
    return DateTime.now()
      .setZone(timezone)
      .minus({ days: 1 })
      .startOf('day')
      .toJSDate()
  },
  getToday: (timezone: string): Date => {
    return DateTime.now().setZone(timezone).toJSDate()
  },
  getYesterday: (timezone: string): Date => {
    return DateTime.now().setZone(timezone).minus({ days: 1 }).toJSDate()
  },

  /** return daysAgo for the given JS Date
   * This also make sure that it is in the same timezone as the given timezone
   * This means if user's timezone changes, the daysAgo will change as well
   */
  getDaysAgo: (givenDate: JsDateAccepter, timezone: string): number => {
    // TODO: Write test for this
    const now: Date = DateTime.now().setZone(timezone).startOf('day').toJSDate()
    const convertedDate = DateTime.fromJSDate(new Date(givenDate))
      .setZone(timezone)
      .startOf('day')
      .toJSDate()

    return ((now.valueOf() - convertedDate.valueOf()) / DAY_IN_MS) | 0
  },
  /**
   * Returns the year of the given date
   * @returns year like 2022, 2023 etc
   */
  getYear: (givenDate: JsDateAccepter, timezone: string): number => {
    return DateTime.fromJSDate(new Date(givenDate)).setZone(timezone).year
  },

  /** Returns JS Start Date and End Date from given nDaysAgo */
  getDateFromDaysAgo: (nDaysAgo: number, timezone: string): [Date, Date] => {
    const nDaysAgoDate = DateTime.now()
      .setZone(timezone)
      .minus({ days: nDaysAgo })

    return [
      nDaysAgoDate.startOf('day').toJSDate(),
      nDaysAgoDate.endOf('day').toJSDate(),
    ]
  },

  getNextDate: (givenDate: JsDateAccepter, timezone: string): Date => {
    return DateTime.fromJSDate(new Date(givenDate))
      .setZone(timezone)
      .plus({ days: 1 })
      .toJSDate()
  },
  getTodayRangeByMins: (
    timezone: string,
    minsFrom: number,
    minsUntil: number,
  ): [Date, Date] => {
    const today = timeHandler.getStartOfToday(timezone)

    return [
      DateTime.fromJSDate(today).plus({ minutes: minsFrom }).toJSDate(),
      DateTime.fromJSDate(today).plus({ minutes: minsUntil }).toJSDate(),
    ]
  },

  getDateFromDaysAgoUntilToday: (
    // if you want to have whole 365 days, set it as 364, as today will be included
    // i.e) nDaysAgo = 1 (yesterday & today) has 2 days
    nDaysAgo: number,
    timezone: string,
  ): [Date, Date] => {
    const endOfToday = DateTime.now().setZone(timezone).endOf('day')
    const nDaysAgoDate = endOfToday.minus({ days: nDaysAgo })

    return [nDaysAgoDate.toJSDate(), endOfToday.toJSDate()]
  },

  getDateFromYear: (year: number, timezone: string): [Date, Date] => {
    const startDate = new Date(`01-01-${year}`)
    const endDate = new Date(`01-01-${year + 1}`)
    return [
      DateTime.fromJSDate(startDate).setZone(timezone).toJSDate(),
      DateTime.fromJSDate(endDate).setZone(timezone).toJSDate(),
    ]
  },
  isWithinDates: (got: Date, from: Date, until: Date): boolean => {
    return from.valueOf() <= got.valueOf() && got.valueOf() <= until.valueOf()
  },
  /** Return true or false if the givenDate is within the nDaysAgo */
  // TODO: Delete me. not used
  isWithinDaysAgo: (
    nDaysAgo: number,
    givenDate: JsDateAccepter,
    timezone: string,
  ) => {
    return nDaysAgo === timeHandler.getDaysAgo(givenDate, timezone)
  },

  /** Returns the date in the format of YYYY-MM-DD */
  getYYYYMMDD: (date: JsDateAccepter, timezone: string): string => {
    return DateTime.fromJSDate(new Date(date))
      .setZone(timezone)
      .toFormat('yyyy-MM-dd')
  },
}
