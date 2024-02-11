import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { DataBasicsDate } from '@/global.interface'
import { timeHandler } from '@/handlers/time.handler'
import { SortOrder } from 'mongoose'

type PrivateToSort =
  | string
  | { [key: string]: SortOrder | { $meta: 'textScore' } }
  | [string, SortOrder][]

export class FactoryRoot<DocumentProps> {
  protected toObjectWithSearch(
    keys: (keyof DocumentProps | '_id')[],
    searchInput: undefined | string,
  ) {
    if (!searchInput) return {}
    // TODO: The speed of the search can be improved by NOT using regex.
    return {
      $or: keys.map((key) => ({
        [key]: { $regex: searchInput, $options: 'i' },
      })),
    }
  }

  /** method that takes key and value and return the object in MDB */
  protected toObject(key: keyof DocumentProps | '_id', value: any) {
    return value == undefined ? {} : { [key]: [value] }
  }

  /** method that takes key and value and return the object in MDB */
  protected toInObject(key: keyof DocumentProps | '_id', value: any[]) {
    return value == undefined ? {} : { [key]: { $in: value } }
  }

  /** method that takes daysAgo and return the range of object in MDB */
  protected toNumRangeObjectByDaysAgo(
    key: keyof DocumentProps | '_id' | keyof DataBasicsDate,
    daysAgo: number,
    atd: AccessTokenDomain,
  ): { [key: string]: { $gte: number; $lt: number } } {
    const [start, end] = timeHandler.getDateFromDaysAgo(daysAgo, atd.timezone)
    return daysAgo == undefined
      ? {}
      : { [key]: { $gte: start.valueOf(), $lt: end.valueOf() } }
  }

  /**
   * method that takes year and return the range of object in MDB
   * If year 2024 is given, query for only data with dateAdded between 2024-01-01 and 2024-12-31 will be returned.
   */
  protected toNumRangeObjectByYear(
    key: keyof DocumentProps | '_id' | keyof DataBasicsDate,
    year: number,
    atd: AccessTokenDomain,
  ): { [key: string]: { $gte: Date; $lt: Date } } {
    const [start, end] = timeHandler.getDateFromYear(year, atd.timezone)

    return year == undefined ? {} : { [key]: { $gte: start, $lt: end } }
  }

  /**
   * method that takes daysAgoUntilToday and return the range of object in MDB
   * If daysAgoUntilToday 365 is given, data range between 365 days ago until today will be returned.
   */
  protected toNumRangeObjectByDaysAgoUntilToday(
    key: keyof DocumentProps | '_id' | keyof DataBasicsDate,
    daysAgoUntilToday: number,
    atd: AccessTokenDomain,
  ): { [key: string]: { $gte: Date; $lt: Date } } {
    const [start, end] = timeHandler.getDateFromDaysAgoUntilToday(
      daysAgoUntilToday,
      atd.timezone,
    )

    return daysAgoUntilToday == undefined
      ? {}
      : { [key]: { $gte: start, $lt: end } }
  }

  public toSort(): PrivateToSort {
    return {
      dateAdded: -1,
    }
  }
}
