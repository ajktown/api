import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { IRitual } from './index.interface'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { ActionGroupModel } from '@/schemas/action-group.schema'

/**
 * Ritual domain groups the ActionDomain
 * i.e) ritual domain: early bird
 * i.e) .. Wake up by 4:30am
 * i.e) .. Take supplement by 4:30am
 * TODO: Maybe enforcing the same end time is a good strategy, for users
 * TODO: to maintain, OR we can suggest them to do so
 */
export class RitualDomain extends DomainRoot {
  private readonly props: IRitual

  private constructor(input: IRitual) {
    super()
    this.props = input
  }

  static async fromUnassociatedActionGroupIds(
    atd: AccessTokenDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<RitualDomain> {
    const docs = await actionGroupModel.find({
      ownerId: atd.userId,
    })

    return new RitualDomain({
      id: 'default',
      ownerId: atd.userId,
      name: 'Unassociated Ritual',
      actionGroupIds: docs.map((doc) => doc.id),
    })
  }

  toResDTO(atd: AccessTokenDomain): IRitual {
    if (atd.userId !== this.props.ownerId) {
      throw new ReadForbiddenError(atd, `Ritual`)
    }
    return this.props
  }
}
