import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'
import { GetRitualsRes } from '@/responses/get-ritual.res'
import { RitualDomain } from './ritual.domain'
import { UserDomain } from '../user/user.domain'
import { RitualModel } from '@/schemas/ritual.schema'
import { BadRequestError } from '@/errors/400/index.error'

export class RitualGroupDomain extends DomainRoot {
  private readonly domains: RitualDomain[]

  private constructor(domains: RitualDomain[]) {
    super()
    this.domains = domains
  }

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
      ritualDocs.map((doc) => RitualDomain.fromDoc(doc, actionGroupDocs)),
    )
  }

  static async fromUser(
    user: UserDomain,
    actionGroupModel: ActionGroupModel,
  ): Promise<RitualGroupDomain> {
    return new RitualGroupDomain([
      await RitualDomain.fromUser(user, actionGroupModel),
    ])
  }

  toDeprecatedResDTO(atd: AccessTokenDomain): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toResDTO(atd)),
    }
  }

  // TODO: There should be Shared type for now
  toSharedResDTO(): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toSharedResDTO()),
    }
  }
}
