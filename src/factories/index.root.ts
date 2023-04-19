import { GetReqDTORoot } from '@/dto/index.root'
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
    query: GetReqDTORoot,
  ) {
    if (!query.searchInput) return {}
    return {
      $or: keys.map((key) => ({
        [key]: { $regex: query.searchInput, $options: 'i' },
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
  protected toRangeObjectByDaysAgo(
    key: keyof DocumentProps | '_id' | keyof DataBasicsDate,
    daysAgo: number,
  ): { [key: string]: { $gte: Date; $lt: Date } } {
    const [start, end] = timeHandler.getDateFromDaysAgo(daysAgo)
    return daysAgo ? { [key]: { $gte: start, $lt: end } } : {}
  }

  public toSort(): PrivateToSort {
    return {
      createdAt: -1,
    }
  }
}
