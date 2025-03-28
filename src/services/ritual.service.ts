import { Injectable } from '@nestjs/common'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import {
  ActionGroupModel,
  ActionGroupProps,
} from '@/schemas/action-group.schema'
import { InjectModel } from '@nestjs/mongoose'
import { RitualActionGroupGroupDomain } from '@/domains/ritual_action_group/ritual-action-group-group.domain'
import { UserDomain } from '@/domains/user/user.domain'
import { RitualModel, RitualProps } from '@/schemas/ritual.schema'
import { PatchRitualGroupBodyDTO } from '@/dto/patch-ritual-group-body.dto'
import { RitualActionGroupDomain } from '@/domains/ritual_action_group/ritual-action-group.domain'
import { RitualDomain } from '@/domains/ritual/ritual.domain'
import { ArchiveModel, ArchiveProps } from '@/schemas/archive.schema'

@Injectable()
export class RitualService {
  constructor(
    @InjectModel(RitualProps.name)
    private readonly ritualModel: RitualModel,
    @InjectModel(ActionGroupProps.name)
    private readonly actionGroupModel: ActionGroupModel,
    @InjectModel(ArchiveProps.name)
    private readonly archiveModel: ArchiveModel,
  ) {}

  /**
   * byAtd returns RitualDomain of a user by access token domain (or requester)
   */
  async byAtd(atd: AccessTokenDomain): Promise<RitualActionGroupGroupDomain> {
    return RitualActionGroupGroupDomain.fromMdb(
      atd,
      this.ritualModel,
      this.actionGroupModel,
      this.archiveModel,
    )
  }

  /**
   * byUser returns RitualDomain of a user by user domain.
   */
  async byUser(userDomain: UserDomain): Promise<RitualActionGroupGroupDomain> {
    return RitualActionGroupGroupDomain.fromUser(
      userDomain,
      this.ritualModel,
      this.actionGroupModel,
      this.archiveModel,
    )
  }

  /**
   * This method will update for you, but won't return updated version.
   * just simply use the byAtd or byUser according to your needs.
   */
  async patchDefault(
    atd: AccessTokenDomain,
    dto: PatchRitualGroupBodyDTO,
  ): Promise<void> {
    const ritualGroup = await this.byAtd(atd)
    await RitualDomain.fromParentRitual(ritualGroup.getDefault()).patch(
      dto,
      this.ritualModel,
    )
  }
}
