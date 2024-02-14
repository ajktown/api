import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import {
  GetActionGroupRes,
  GetActionGroupsRes,
} from '@/responses/get-action-groups.res'
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

  toResDTO(atd: AccessTokenDomain): GetActionGroupsRes {
    const map = new Map<string, GetActionGroupRes>()
    const actionGroups = this.domains.map((d) => d.toResDTO(atd))
    actionGroups.forEach((d) => map.set(d.props.id, d))

    return {
      ids: actionGroups.map((d) => d.props.id),
      actionGroups: Object.fromEntries(map),
    }
  }
}
