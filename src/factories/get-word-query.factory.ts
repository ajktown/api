import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { Injectable } from '@nestjs/common'
import { SortOrder } from 'mongoose'

// TODO: Gotta refactor this too.
type PrivateReturning =
  | string
  | { [key: string]: SortOrder | { $meta: 'textScore' } }
  | [string, SortOrder][]

@Injectable()
export class GetWordQueryFactory {
  // TODO: This should be moved to RootFactory
  // TODO: Choose the correct name not "TITLE" probably key?
  toObject(title: string, value: any) {
    return value ? { [title]: [value] } : {}
  }

  toFind(query: GetWordQueryDTO) {
    return {
      ...this.toObject('_id', query.id),
    }
  }

  toSort(): PrivateReturning {
    return {
      createdAt: -1,
    }
  }
}
