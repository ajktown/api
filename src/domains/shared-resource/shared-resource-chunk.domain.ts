import { AccessTokenDomain } from '../auth/access-token.domain'
import { SharedResourceDomain } from './shared-resource.domain'
import { GetSharedResourcesQueryDTO } from '@/dto/get-shared-resources-query.dto'
import { SharedResourceModel } from '@/schemas/shared-resources.schema'
import { GetSharedResourcesQueryFactory } from '@/factories/get-shared-resources-query.factory'

// TODO: Not complete yet.
export class SharedResourceChunkDomain {
  private readonly atd: AccessTokenDomain
  private readonly sharedResources: SharedResourceDomain[]
  private readonly query: GetSharedResourcesQueryDTO

  private constructor(
    atd: AccessTokenDomain,
    words: SharedResourceDomain[],
    query: GetSharedResourcesQueryDTO,
  ) {
    this.atd = atd
    this.sharedResources = words
    this.query = query
  }

  static async fromMdb(
    atd: AccessTokenDomain,
    query: GetSharedResourcesQueryDTO,
    model: SharedResourceModel,
    factory: GetSharedResourcesQueryFactory,
  ): Promise<SharedResourceChunkDomain> {
    return new SharedResourceChunkDomain(
      atd,
      (
        await model
          .find(
            factory.getFilter(),
            factory.getProjection(),
            factory.getOptions(),
          )
          .exec()
      ).map((raw) => SharedResourceDomain.fromMdb(raw)),
      query,
    )
  }
}
