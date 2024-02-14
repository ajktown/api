import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { GetActionGroupIdsRes } from '@/responses/get-action-groups.res'
import { ActionGroupModel } from '@/schemas/action-group.schema'

export class ActionGroupIdsDomain extends DomainRoot {
  private readonly ids: string[]

  private constructor(ids: string[]) {
    super()
    this.ids = ids
  }

  static async fromMdb(
    atd: AccessTokenDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<ActionGroupIdsDomain> {
    const docs = await actionGroupModel.find({
      ownerId: atd.userId,
    })

    return new ActionGroupIdsDomain(docs.map((d) => d.id))
  }

  toResDTO(): GetActionGroupIdsRes {
    return { ids: this.ids }
  }
}
