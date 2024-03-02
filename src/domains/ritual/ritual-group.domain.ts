import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'
import { GetRitualsRes } from '@/responses/get-ritual.res'
import { RitualDomain } from './ritual.domain'
import { UserDomain } from '../user/user.domain'

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
    return new RitualGroupDomain([
      await RitualDomain.fromUnassociatedActionGroupIds(atd, actionGroupModel),
    ])
  }

  static async fromUser(
    user: UserDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<RitualGroupDomain> {
    return new RitualGroupDomain([
      await RitualDomain.fromUser(user, actionGroupModel),
    ])
  }

  toResDTO(atd: AccessTokenDomain): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toResDTO(atd)),
    }
  }

  // TODO: There should be Shared type for now
  toSharedResDTO(): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toSharedResDTO()),
    }
  }
}
