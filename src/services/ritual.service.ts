import { Injectable } from '@nestjs/common'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import {
  ActionGroupModel,
  ActionGroupProps,
} from '@/schemas/action-group.schema'
import { InjectModel } from '@nestjs/mongoose'
import { RitualGroupDomain } from '@/domains/ritual/ritual-group.domain'

@Injectable()
export class RitualService {
  constructor(
    @InjectModel(ActionGroupProps.name)
    private actionGroupModel: ActionGroupModel,
  ) {}

  async get(atd: AccessTokenDomain): Promise<RitualGroupDomain> {
    return RitualGroupDomain.fromMdb(atd, this.actionGroupModel)
  }
}
