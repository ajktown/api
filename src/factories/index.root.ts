import { SortOrder } from 'mongoose'

type PrivateToSort =
  | string
  | { [key: string]: SortOrder | { $meta: 'textScore' } }
  | [string, SortOrder][]

export class FactoryRoot {
  protected toObject(key: string, value: any) {
    return value ? { [key]: [value] } : {}
  }

  public toSort(): PrivateToSort {
    return {
      createdAt: -1,
    }
  }
}
