import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { IParentRitual, IRitual } from './index.interface'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { ActionGroupDoc } from '@/schemas/action-group.schema'
import { RitualDoc } from '@/schemas/ritual.schema'
import { GetRitualByIdRes } from '@/responses/get-ritual.res'
import { GetRitualQueryDTO } from '@/dto/get-rituals-query.dto'
import { PatchRitualGroupBodyDTO } from '@/dto/patch-ritual-group-body.dto'

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

  get iRitual(): IRitual {
    return {
      id: this.props.id,
      ownerId: this.props.ownerId,
      name: this.props.name,
      orderedActionGroupIds: this.props.orderedActionGroupIds,
    }
  }

  /**
   * ParentRitual takes responsibility of the order of action groups
   */
  static fromDoc(
    doc: RitualDoc,
    actionGroupDocs: ActionGroupDoc[],
    archivedActionGroupIds: string[],
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
          // If both are in the user-defined order, prioritize by their indices:
          if (map.has(a.id) && map.has(b.id))
            return map.get(a.id) - map.get(b.id)

          // If only one is in the user-defined order, prioritize it:
          if (map.has(a.id)) return -1
          if (map.has(b.id)) return 1

          // Default fallback: prioritize by closeMinsAfter:
          if (a.closeMinsAfter !== b.closeMinsAfter)
            return a.closeMinsAfter - b.closeMinsAfter

          // Further fallback: prioritize by openMinsAfter:
          return a.openMinsAfter - b.openMinsAfter
        })
        .map((doc) => doc.id),
      archivedActionGroupSet: new Set(archivedActionGroupIds),
    })
  }

  toResDTO(dto: GetRitualQueryDTO | PatchRitualGroupBodyDTO): GetRitualByIdRes {
    if (dto?.isArchived === undefined) {
      return {
        ritual: this.props,
      }
    }

    if (dto.isArchived) {
      return {
        ritual: {
          ...this.props,
          actionGroupIds: this.props.actionGroupIds.filter((id) =>
            this.props.archivedActionGroupSet.has(id),
          ),
          orderedActionGroupIds: this.props.orderedActionGroupIds.filter((id) =>
            this.props.archivedActionGroupSet.has(id),
          ),
        },
      }
    }

    return {
      ritual: {
        ...this.props,
        actionGroupIds: this.props.actionGroupIds.filter(
          (id) => !this.props.archivedActionGroupSet.has(id),
        ),
        orderedActionGroupIds: this.props.orderedActionGroupIds.filter(
          (id) => !this.props.archivedActionGroupSet.has(id),
        ),
      },
    }
  }

  toDerivedResDTO(
    atd: AccessTokenDomain,
    dto: GetRitualQueryDTO,
  ): GetRitualByIdRes {
    if (atd.userId !== this.props.ownerId) {
      throw new ReadForbiddenError(atd, `ParentRitual`)
    }
    return this.toResDTO(dto) // for now only
  }

  // TODO: This should return GetSharedRitualsRes or something
  toSharedResDTO(): GetRitualByIdRes {
    // Only non-archived action groups visible at this moment:
    return this.toResDTO({ isArchived: false }) // for now only
  }
}
