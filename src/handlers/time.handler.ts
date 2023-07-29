import { DateTime } from 'luxon'

// This is the JS approved date type that should be acceptable
type JsDateAccepter = number | string | Date
const DAY_IN_MS = 24 * 60 * 60 * 1000

export const timeHandler = {
  /** return daysAgo for the given JS Date */
  getDaysAgo: (givenDate: JsDateAccepter, timezone: string): number => {
    const today: Date = DateTime.now().setZone(timezone).toJSDate()
    const convertedDate = new Date(givenDate)

    return ((today.valueOf() - convertedDate.valueOf()) / DAY_IN_MS) | 0
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

  /** Return true or false if the givenDate is within the nDaysAgo */
  isWithinDaysAgo: (
    nDaysAgo: number,
    givenDate: JsDateAccepter,
    timezone: string,
  ) => {
    return nDaysAgo === timeHandler.getDaysAgo(givenDate, timezone)
  },
}
