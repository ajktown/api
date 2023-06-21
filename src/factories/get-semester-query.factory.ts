import { WordProps } from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { FactoryRoot } from './index.root'
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'

@Injectable()
export class GetSemesterQueryFactory extends FactoryRoot<WordProps> {
  getFilter(atd: AccessTokenDomain): FilterQuery<WordProps> {
    return {
      ownerID: atd.userId,
    }
  }

  getProjection(): ProjectionType<WordProps> {
    return undefined
  }

  getOptions(): QueryOptions<WordProps> {
    return {}
  }
}
