import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { IRitual } from './index.interface'
import { RitualModel } from '@/schemas/ritual.schema'
import { PatchRitualGroupBodyDTO } from '@/dto/patch-ritual-group-body.dto'
import { ParentRitualDomain } from './parent-ritual.domain'

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

  static fromParentRitual(domain: ParentRitualDomain): RitualDomain {
    return new RitualDomain(domain.iRitual)
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

  async patch(
    dto: PatchRitualGroupBodyDTO,
    model: RitualModel,
  ): Promise<RitualDomain> {
    const doc = await model.findByIdAndUpdate(
      this.id,
      {
        // name: dto.name, // TODO: Name is not yet supported
        orderedActionGroupIds: dto.actionGroupIds,
      },
      { new: true },
    )
    return new RitualDomain({
      id: doc.id,
      ownerId: doc.ownerId,
      name: doc.name,
      orderedActionGroupIds: doc.orderedActionGroupIds,
    })
  }
}
