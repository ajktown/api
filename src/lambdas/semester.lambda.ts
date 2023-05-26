export const semesterLambda = {
  /** Returns semester value with given date in UTC standard rather than local time that server runs. */
  fromDate: (givenDate: Date) => {
    const year = (givenDate.getUTCFullYear() - 2000) * 10 // i.e) 23: Year of 2023
    const quarter = Math.floor(givenDate.getUTCMonth() / 3) + 1 // i.e) 1 ~ 4
    return year + quarter
  },
  /** Returns year and quarter of the given semester */
  toYearAndQuarter: (semester: number) => {
    const year = Math.floor(semester / 10) + 2000
    const quarter = semester % 10
    return { year, quarter }
  },
  now: () => {
    return semesterLambda.fromDate(new Date())
  },
}
