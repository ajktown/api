import { DomainRoot } from '../index.root'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'
import { GetRitualsRes } from '@/responses/get-ritual.res'
import { RitualDomain } from './ritual.domain'
import { UserDomain } from '../user/user.domain'
import { RitualModel } from '@/schemas/ritual.schema'
import { NotExistOrNoPermissionError } from '@/errors/404/not-exist-or-no-permission.error'
import { ParentRitualDomain } from './parent-ritual.domain'
import { ArchiveModel } from '@/schemas/archive.schema'
import { ArchiveDomain } from '../archive/archive.domain'
import { GetRitualQueryDTO } from '@/dto/get-rituals-query.dto'
import { CriticalError } from '@/errors/500/critical.error'

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
    archiveModel: ArchiveModel,
    disableRecursion: boolean = false,
  ): Promise<RitualGroupDomain> {
    const ritualDocs = await ritualModel.find({
      ownerId: atd.userId,
    })

    if (ritualDocs.length === 0) {
      if (disableRecursion) {
        throw new CriticalError(
          'RitualDocs are still not found when recursion is disabled',
        )
      }

      await RitualDomain.postDefault(atd, ritualModel)
      return RitualGroupDomain.fromMdb(
        atd,
        ritualModel,
        actionGroupModel,
        archiveModel,
        true,
      )
    }

    // Retrieve archived action group ids:
    const docs = await archiveModel.find({
      ownerId: atd.userId,
    })
    const archivedActionGroupIds = docs
      .map((doc) => ArchiveDomain.fromDoc(doc))
      .filter((d) => d.isActionGroupArchived)
      .map((d) => d.actionGroupId)

    const actionGroupDocs = await actionGroupModel.find({
      ownerId: atd.userId,
    })
    return new RitualGroupDomain(
      ritualDocs.map((doc) =>
        ParentRitualDomain.fromDoc(
          doc,
          actionGroupDocs,
          archivedActionGroupIds,
        ),
      ),
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
    archiveModel: ArchiveModel,
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

    // Retrieve archived action group ids:
    const docs = await archiveModel.find({
      ownerId: userDomain.id,
    })
    const archivedActionGroupIds = docs
      .map((doc) => ArchiveDomain.fromDoc(doc))
      .filter((d) => d.isActionGroupArchived)
      .map((d) => d.actionGroupId)

    return new RitualGroupDomain(
      ritualDocs.map((doc) =>
        ParentRitualDomain.fromDoc(
          doc,
          actionGroupDocs,
          archivedActionGroupIds,
        ),
      ),
    )
  }

  toResDTO(atd: AccessTokenDomain, dto: GetRitualQueryDTO): GetRitualsRes {
    return {
      rituals: this.domains.map(
        (domain) => domain.toDerivedResDTO(atd, dto).ritual,
      ),
    }
  }

  // TODO: There should be Shared type for now
  toSharedResDTO(): GetRitualsRes {
    return {
      rituals: this.domains.map((domain) => domain.toSharedResDTO().ritual),
    }
  }
}
