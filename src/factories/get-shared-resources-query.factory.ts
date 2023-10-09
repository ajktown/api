import { Injectable } from '@nestjs/common'
import { FactoryRoot } from './index.root'
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose'
import { SharedResourceProps } from '@/schemas/shared-resources.schema'

// TODO: Write it. Just boilerplate at this point.
@Injectable()
export class GetSharedResourcesQueryFactory extends FactoryRoot<SharedResourceProps> {
  getFilter(): FilterQuery<SharedResourceProps> {
    return undefined
  }

  getProjection(): ProjectionType<SharedResourceProps> {
    return undefined
  }

  getOptions(): QueryOptions<SharedResourceProps> {
    return undefined
  }
}
