// This is the JS approved date type that should be acceptable
type JsDateAccepter = number | string | Date
const DAY_IN_MS = 24 * 60 * 60 * 1000

export const timeHandler = {
  getDaysAgo: (givenDate: JsDateAccepter): number => {
    const today = new Date()
    const convertedDate = new Date(givenDate)

    return ((today.valueOf() - convertedDate.valueOf()) / DAY_IN_MS) | 0
  },
  isWithinDaysAgo: (nDaysAgo: number, givenDate: JsDateAccepter) => {
    return nDaysAgo === timeHandler.getDaysAgo(givenDate)
  },
}
