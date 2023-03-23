import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { DeprecatedWordSchemaProps } from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { FactoryRoot } from './index.root'

@Injectable()
export class GetWordQueryFactory extends FactoryRoot<DeprecatedWordSchemaProps> {
  toFind(query: GetWordQueryDTO) {
    return {
      ...this.toObject('_id', query.id),
      ...this.toObject('language', query.languageCode),
      ...this.toObject('sem', query.semester),
      ...this.toObject('isFavorite', query.isFavorite),
      ...this.toObject('word', query.term),
      ...this.toObject('pronun', query.pronunciation),
      ...this.toObject('meaning', query.definition),
      ...this.toObject('example', query.example),
    }
  }
}
