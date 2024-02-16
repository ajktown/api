import { Injectable } from '@nestjs/common'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import {
  ActionGroupModel,
  ActionGroupProps,
} from '@/schemas/action-group.schema'
import { InjectModel } from '@nestjs/mongoose'
import { RitualDomain } from '@/domains/ritual/ritual.domain'

@Injectable()
export class RitualService {
  constructor(
    @InjectModel(ActionGroupProps.name)
    private actionGroupModel: ActionGroupModel,
  ) {}

  async get(atd: AccessTokenDomain): Promise<RitualDomain> {
    return RitualDomain.fromMdb(atd, this.actionGroupModel)
  }
}
