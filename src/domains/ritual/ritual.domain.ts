import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'
import { GetRitualRes } from '@/responses/get-ritual.res'

/**
 * Ritual domain groups the ActionDomain
 * i.e) ritual domain: early bird
 * i.e) .. Wake up by 4:30am
 * i.e) .. Take supplement by 4:30am
 * TODO: Maybe enforcing the same end time is a good strategy, for users
 * TODO: to maintain, OR we can suggest them to do so
 */
export class RitualDomain extends DomainRoot {
  private readonly actionGroupIds: string[]

  private constructor(actionGroupIds: string[]) {
    super()
    this.actionGroupIds = actionGroupIds
  }

  static async fromMdb(
    atd: AccessTokenDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<RitualDomain> {
    const docs = await actionGroupModel.find({
      ownerId: atd.userId,
    })

    return new RitualDomain(docs.map((d) => d.id))
  }

  toResDTO(): GetRitualRes {
    return { actionGroupIds: this.actionGroupIds }
  }
}
