import { DeprecatedWordSchemaProps } from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { FactoryRoot } from './index.root'
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'

@Injectable()
export class GetSemesterQueryFactory extends FactoryRoot<DeprecatedWordSchemaProps> {
  getFilter(atd: AccessTokenDomain): FilterQuery<DeprecatedWordSchemaProps> {
    return {
      ownerID: atd.userId,
    }
  }

  getProjection(): ProjectionType<DeprecatedWordSchemaProps> {
    return undefined
  }

  getOptions(): QueryOptions<DeprecatedWordSchemaProps> {
    return {}
  }
}
