import { DateTime } from 'luxon'

// This is the JS approved date type that should be acceptable
type JsDateAccepter = number | string | Date
const DAY_IN_MS = 24 * 60 * 60 * 1000

export const timeHandler = {
  /** return daysAgo for the given JS Date
   * This also make sure that it is in the same timezone as the given timezone
   * This means if user's timezone changes, the daysAgo will change as well
   */
  getDaysAgo: (givenDate: JsDateAccepter, timezone: string): number => {
    // TODO: Write test for this
    const now: Date = DateTime.now().setZone(timezone).startOf('day').toJSDate()
    const convertedDate = DateTime.fromJSDate(new Date(givenDate))
      .startOf('day')
      .toJSDate()

    return (now.valueOf() - convertedDate.valueOf()) / DAY_IN_MS
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
}
