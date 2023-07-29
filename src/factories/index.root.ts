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
    return value ? { [key]: [value] } : {}
  }

  /** method that takes key and value and return the object in MDB */
  protected toInObject(key: keyof DocumentProps | '_id', value: any[]) {
    return value ? { [key]: { $in: value } } : {}
  }

  /** method that takes daysAgo and return the range of object in MDB */
  protected toNumRangeObjectByDaysAgo(
    key: keyof DocumentProps | '_id' | keyof DataBasicsDate,
    daysAgo: number,
    atd: AccessTokenDomain,
  ): { [key: string]: { $gte: number; $lt: number } } {
    const [start, end] = timeHandler.getDateFromDaysAgo(daysAgo, atd)
    return daysAgo != undefined
      ? { [key]: { $gte: start.valueOf(), $lt: end.valueOf() } }
      : {}
  }

  /** method that takes daysAgo and return the range of object in MDB */
  protected toRangeObjectByDaysAgo(
    key: keyof DocumentProps | '_id' | keyof DataBasicsDate,
    daysAgo: number,
    atd: AccessTokenDomain,
  ): { [key: string]: { $gte: Date; $lt: Date } } {
    const [start, end] = timeHandler.getDateFromDaysAgo(daysAgo, atd)
    return daysAgo != undefined ? { [key]: { $gte: start, $lt: end } } : {}
  }

  public toSort(): PrivateToSort {
    return {
      dateAdded: -1,
    }
  }
}
