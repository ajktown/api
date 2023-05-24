/** Returns semester value with given date in UTC standard rather than local time that server runs. */
export const getSemesterByDataLambda = (givenDate: Date) => {
  const year = (givenDate.getUTCFullYear() - 2000) * 10 // i.e) 23: Year of 2023
  const quarter = Math.floor(givenDate.getUTCMonth() / 3) + 1 // i.e) 1 ~ 4
  return year + quarter
}
