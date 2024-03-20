import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { IRitual } from './index.interface'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { ActionGroupDoc } from '@/schemas/action-group.schema'
import { RitualDoc, RitualModel } from '@/schemas/ritual.schema'
import { PatchRitualGroupBodyDTO } from '@/dto/patch-ritual-group-body.dto'

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

  get id() {
    return this.props.id
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
      orderedActionGroupIds: [],
    }).save()

    return new RitualDomain({
      id: newRitualDoc.id,
      ownerId: newRitualDoc.ownerId,
      name: newRitualDoc.name,
      orderedActionGroupIds: newRitualDoc.orderedActionGroupIds,
    })
  }

  /**
   * Ritual takes responsibility of the order of action groups
   */
  static fromDoc(
    doc: RitualDoc,
    actionGroupDocs: ActionGroupDoc[],
  ): RitualDomain {
    // map contains user's own order of action groups
    // the lower the i (or index), the higher the priority it should be seen
    // despite of its openMinsAfter or closeMinsAfter
    const map = new Map(doc.orderedActionGroupIds.map((id, i) => [id, i]))

    return new RitualDomain({
      id: doc.id,
      ownerId: doc.ownerId,
      name: doc.name,
      orderedActionGroupIds: actionGroupDocs
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

  toResDTO(): IRitual {
    return this.props
  }

  toDerivedResDTO(atd: AccessTokenDomain): IRitual {
    if (atd.userId !== this.props.ownerId) {
      throw new ReadForbiddenError(atd, `Ritual`)
    }
    return this.props
  }

  // TODO: This should return IRitualShared
  toSharedResDTO(): IRitual {
    return this.props
  }

  async patch(dto: PatchRitualGroupBodyDTO, model: RitualModel): Promise<void> {
    await model.findByIdAndUpdate(
      this.id,
      {
        // name: dto.name, // TODO: Name is not yet supported
        orderedActionGroupIds: dto.orderedActionGroupIds,
      },
      { new: true },
    )
  }
}
