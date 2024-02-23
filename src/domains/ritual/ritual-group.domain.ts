import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'
import { GetRitualsRes } from '@/responses/get-ritual.res'
import { RitualDomain } from './ritual.domain'

export class RitualGroupDomain extends DomainRoot {
  private readonly domains: RitualDomain[]

  private constructor(domains: RitualDomain[]) {
    super()
    this.domains = domains
  }

  static async fromMdb(
    atd: AccessTokenDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<RitualGroupDomain> {
    const docs = await actionGroupModel.find({
      ownerId: atd.userId,
    })

    return new RitualGroupDomain([
      RitualDomain.fromUnassociatedActionGroupIds(
        atd,
        docs.map((doc) => doc.id),
      ),
    ])
  }

  toResDTO(atd: AccessTokenDomain): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toResDTO(atd)),
    }
  }
}
