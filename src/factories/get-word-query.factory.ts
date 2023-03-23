import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { Injectable } from '@nestjs/common'
import { FactoryRoot } from './index.root'

@Injectable()
export class GetWordQueryFactory extends FactoryRoot {
  toFind(query: GetWordQueryDTO) {
    return {
      ...this.toObject('_id', query.id),
    }
  }
}
