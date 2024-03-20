import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { IRitual } from './index.interface'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { ActionGroupDoc, ActionGroupModel } from '@/schemas/action-group.schema'
import { UserDomain } from '../user/user.domain'
import { RitualDoc, RitualModel } from '@/schemas/ritual.schema'

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

  /**
   * Post a default ritual for the user.
   * This is called when the user has no ritual, but
   * it guarantees that the API works fine, even if it is called more than once.
   */
  static async postDefault(
    atd: AccessTokenDomain,
    model: RitualModel,
  ): Promise<RitualDomain> {
    const newRitualDoc = await new model({
      ownerId: atd.userId,
      name: 'Default Ritual',
      actionGroupIds: [],
    }).save()

    return new RitualDomain({
      id: newRitualDoc.id,
      ownerId: newRitualDoc.ownerId,
      name: newRitualDoc.name,
      actionGroupIds: newRitualDoc.actionGroupIds,
    })
  }

  static fromDoc(
    doc: RitualDoc,
    actionGroupDocs: ActionGroupDoc[],
  ): RitualDomain {
    return new RitualDomain({
      id: doc.id,
      ownerId: doc.ownerId,
      name: doc.name,
      actionGroupIds: actionGroupDocs.map((doc) => doc.id),
    })
  }

  static async deprecatedFromMdb(
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
      actionGroupIds: docs
        .sort((a, b) => a.openMinsAfter - b.openMinsAfter)
        .sort((a, b) => a.closeMinsAfter - b.closeMinsAfter)
        .map((doc) => doc.id),
    })
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
      actionGroupIds: docs
        .sort((a, b) => a.openMinsAfter - b.openMinsAfter)
        .sort((a, b) => a.closeMinsAfter - b.closeMinsAfter)
        .map((doc) => doc.id),
    })
  }

  static async fromUser(
    user: UserDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<RitualDomain> {
    const docs = await actionGroupModel.find({
      ownerId: user.id,
    })

    return new RitualDomain({
      id: 'default',
      ownerId: user.id,
      name: 'Unassociated Ritual',
      actionGroupIds: docs
        .sort((a, b) => a.openMinsAfter - b.openMinsAfter)
        .sort((a, b) => a.closeMinsAfter - b.closeMinsAfter)
        .map((doc) => doc.id),
    })
  }

  toResDTO(atd: AccessTokenDomain): IRitual {
    if (atd.userId !== this.props.ownerId) {
      throw new ReadForbiddenError(atd, `Ritual`)
    }
    return this.props
  }

  // TODO: This should return IRitualShared
  toSharedResDTO(): IRitual {
    return this.props
  }
}
