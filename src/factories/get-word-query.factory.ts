import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { WordProps } from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { FactoryRoot } from './index.root'
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { UnidentifiedUserError } from '@/errors/401/unidentified-user.error'

@Injectable()
export class GetWordQueryFactory extends FactoryRoot<WordProps> {
  private getFilterForSearchInput(query: GetWordQueryDTO) {
    if (!query.searchInput) return {}

    return this.toObjectWithSearch(
      ['word', 'pronun', 'meaning', 'subDefinition', 'example'],
      query.searchInput,
    )
  }

  getFilter(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
  ): FilterQuery<WordProps> {
    if (!atd.userId) throw new UnidentifiedUserError()

    return {
      ownerID: atd.userId,
      ...this.getFilterForSearchInput(query),
      ...this.toObject('_id', query.id),
      ...this.toObject('language', query.languageCode),
      ...this.toInObject('language', query.languageCodes),
      ...this.toObject('sem', query.semester),
      ...this.toObject('isFavorite', query.isFavorite),
      ...this.toObject('word', query.term),
      ...this.toObject('pronun', query.pronunciation),
      ...this.toObject('meaning', query.definition),
      ...this.toObject('example', query.example),
      ...this.toNumRangeObjectByYear('dateAdded', query.year, atd),
      ...this.toNumRangeObjectByDaysAgo('dateAdded', query.daysAgo, atd),
      ...this.toNumRangeObjectByDaysAgoUntilToday(
        'dateAdded',
        query.daysAgoUntilToday,
        atd,
      ),
      ...this.toInObject('tag', query.tags),
      ...this.toObject('isArchived', query.isArchived),
    }
  }

  getProjection(): ProjectionType<WordProps> {
    return undefined
  }

  getOptions(query: GetWordQueryDTO): QueryOptions<WordProps> {
    if (!query.searchInput) return {}

    return {
      collation: {
        locale: 'en',
        strength: 2, // 2: case insensitive (level 1 ~ 5)
      },
    }
  }
}
