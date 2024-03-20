import { Injectable } from '@nestjs/common'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import {
  ActionGroupModel,
  ActionGroupProps,
} from '@/schemas/action-group.schema'
import { InjectModel } from '@nestjs/mongoose'
import { RitualGroupDomain } from '@/domains/ritual/ritual-group.domain'
import { UserDomain } from '@/domains/user/user.domain'
import { RitualModel, RitualProps } from '@/schemas/ritual.schema'

@Injectable()
export class RitualService {
  constructor(
    @InjectModel(RitualProps.name)
    private ritualModel: RitualModel,
    @InjectModel(ActionGroupProps.name)
    private actionGroupModel: ActionGroupModel,
  ) {}

  /**
   * byAtd returns RitualDomain of a user by access token domain (or requester)
   */
  async byAtd(atd: AccessTokenDomain): Promise<RitualGroupDomain> {
    return RitualGroupDomain.fromMdb(
      atd,
      this.ritualModel,
      this.actionGroupModel,
    )
  }

  /**
   * byUser returns RitualDomain of a user by user domain.
   */
  async byUser(userDomain: UserDomain): Promise<RitualGroupDomain> {
    return RitualGroupDomain.fromUser(userDomain, this.actionGroupModel)
  }
}
