import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { GetActionGroupsRes } from '@/responses/get-action-groups.res'
import { ActionGroupDomain } from './action-group.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'

export class ActionGroupsDomain extends DomainRoot {
  private readonly domains: ActionGroupDomain[]

  private constructor(domains: ActionGroupDomain[]) {
    super()
    this.domains = domains
  }

  static async fromMdb(
    atd: AccessTokenDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<ActionGroupsDomain> {
    const docs = await actionGroupModel.find({
      ownerId: atd.userId,
    })

    return new ActionGroupsDomain(docs.map((d) => ActionGroupDomain.fromMdb(d)))
  }

  static fromDomains(domains: ActionGroupDomain[]): ActionGroupsDomain {
    return new ActionGroupsDomain(domains)
  }

  toResDTO(): GetActionGroupsRes {
    return { ids: this.domains.map((d) => d.id) }
  }
}
