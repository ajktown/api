import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { IParentRitual } from './index.interface'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { ActionGroupDoc } from '@/schemas/action-group.schema'
import { RitualDoc } from '@/schemas/ritual.schema'

/**
 * ParentRitualDomain has both values:
 *   - RitualDomain
 *   - ActionGroup ids
 * i.e) ritual domain: early bird
 * i.e) .. Wake up by 4:30am
 * i.e) .. Take supplement by 4:30am
 * TODO: Maybe enforcing the same end time is a good strategy, for users
 * TODO: to maintain, OR we can suggest them to do so
 */
export class ParentRitualDomain extends DomainRoot {
  private readonly props: IParentRitual

  private constructor(input: IParentRitual) {
    super()
    this.props = input
  }

  get id() {
    return this.props.id
  }

  /**
   * ParentRitual takes responsibility of the order of action groups
   */
  static fromDoc(
    doc: RitualDoc,
    actionGroupDocs: ActionGroupDoc[],
  ): ParentRitualDomain {
    // map contains user's own order of action groups
    // the lower the i (or index), the higher the priority it should be seen
    // despite of its openMinsAfter or closeMinsAfter
    const map = new Map(doc.orderedActionGroupIds.map((id, i) => [id, i]))

    return new ParentRitualDomain({
      id: doc.id,
      ownerId: doc.ownerId,
      name: doc.name,
      orderedActionGroupIds: doc.orderedActionGroupIds,
      actionGroupIds: actionGroupDocs
        .sort((a, b) => {
          if (map.has(a.id) && map.has(b.id)) {
            return map.get(a.id) - map.get(b.id)
          }
          if (a.closeMinsAfter !== b.closeMinsAfter)
            return a.closeMinsAfter - b.closeMinsAfter
          return a.openMinsAfter - b.openMinsAfter
        })
        .map((doc) => doc.id),
    })
  }

  toResDTO(): IParentRitual {
    return this.props
  }

  toDerivedResDTO(atd: AccessTokenDomain): IParentRitual {
    if (atd.userId !== this.props.ownerId) {
      throw new ReadForbiddenError(atd, `ParentRitual`)
    }
    return this.props
  }

  // TODO: This should return IRitualShared
  toSharedResDTO(): IParentRitual {
    return this.props
  }
}
