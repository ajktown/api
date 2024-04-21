import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'
import { GetRitualsRes } from '@/responses/get-ritual.res'
import { RitualDomain } from './ritual.domain'
import { UserDomain } from '../user/user.domain'
import { RitualModel } from '@/schemas/ritual.schema'
import { BadRequestError } from '@/errors/400/index.error'
import { NotExistOrNoPermissionError } from '@/errors/404/not-exist-or-no-permission.error'
import { ParentRitualDomain } from './parent-ritual.domain'

export class RitualGroupDomain extends DomainRoot {
  private readonly domains: ParentRitualDomain[]

  private constructor(domains: ParentRitualDomain[]) {
    super()
    this.domains = domains
  }

  // default is the first one always.
  getDefault(): ParentRitualDomain {
    if (this.domains.length === 0) throw new NotExistOrNoPermissionError()
    return this.domains[0]
  }

  /**
   * Get the rituals of a requester.
   * If the requester has no ritual, it will post a default ritual for the user.
   */
  static async fromMdb(
    atd: AccessTokenDomain,
    ritualModel: RitualModel,
    actionGroupModel: ActionGroupModel,
    disableRecursion: boolean = false,
  ): Promise<RitualGroupDomain> {
    const ritualDocs = await ritualModel.find({
      ownerId: atd.userId,
    })

    if (ritualDocs.length === 0) {
      if (disableRecursion) {
        throw new BadRequestError('Something went wrong critically')
      }

      await RitualDomain.postDefault(atd, ritualModel)
      return RitualGroupDomain.fromMdb(atd, ritualModel, actionGroupModel, true)
    }

    const actionGroupDocs = await actionGroupModel.find({
      ownerId: atd.userId,
    })
    return new RitualGroupDomain(
      ritualDocs.map((doc) => ParentRitualDomain.fromDoc(doc, actionGroupDocs)),
    )
  }

  /**
   * Returns rituals of a user.
   * TODO: Certain data must be filtered out if user wishes.
   * If user has no ritual, it will throw an error as it is considered the user has never signed in in the first place
   */
  static async fromUser(
    userDomain: UserDomain,
    ritualModel: RitualModel,
    actionGroupModel: ActionGroupModel,
  ): Promise<RitualGroupDomain> {
    const ritualDocs = await ritualModel.find({
      ownerId: userDomain.id,
    })

    if (ritualDocs.length === 0) {
      throw new NotExistOrNoPermissionError()
    }

    const actionGroupDocs = await actionGroupModel.find({
      ownerId: userDomain.id,
    })
    return new RitualGroupDomain(
      ritualDocs.map((doc) => ParentRitualDomain.fromDoc(doc, actionGroupDocs)),
    )
  }

  toResDTO(atd: AccessTokenDomain): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toDerivedResDTO(atd).ritual),
    }
  }

  // TODO: There should be Shared type for now
  toSharedResDTO(): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toSharedResDTO().ritual),
    }
  }
}
