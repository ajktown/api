import { DateTime } from 'luxon'
// This is the JS approved date type that should be acceptable
type JsDateAccepter = number | string | Date
const DAY_IN_MS = 24 * 60 * 60 * 1000

export const timeHandler = {
  /** return daysAgo for the given JS Date */
  getDaysAgo: (givenDate: JsDateAccepter): number => {
    const today = new Date()
    const convertedDate = new Date(givenDate)

    return ((today.valueOf() - convertedDate.valueOf()) / DAY_IN_MS) | 0
  },
  /** Returns JS Start Date and End Date from given nDaysAgo */
  getDateFromDaysAgo: (nDaysAgo: number): [Date, Date] => {
    const nDaysAgoDate = new Date(new Date().valueOf() - nDaysAgo * DAY_IN_MS)

    return [
      DateTime.fromJSDate(nDaysAgoDate).startOf('day').toJSDate(),
      DateTime.fromJSDate(nDaysAgoDate).endOf('day').toJSDate(),
    ]
  },

  /** Return true or false if the givenDate is within the nDaysAgo */
  isWithinDaysAgo: (nDaysAgo: number, givenDate: JsDateAccepter) => {
    return nDaysAgo === timeHandler.getDaysAgo(givenDate)
  },
}
