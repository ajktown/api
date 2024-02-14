import { Injectable } from '@nestjs/common'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionGroupDomain } from '@/domains/action/action-group.domain'
import { WordService } from './word.service'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostActionGroupDTO } from '@/dto/post-action-group.dto'
import {
  ActionGroupModel,
  ActionGroupProps,
} from '@/schemas/action-group.schema'
import { InjectModel } from '@nestjs/mongoose'
import { ActionGroupFixedId } from '@/constants/action-group.const'
import { ActionModel, ActionProps } from '@/schemas/action.schema'
import { ActionGroupIdsDomain } from '@/domains/action/action-group-ids.domain'

@Injectable()
export class ActionGroupService {
  constructor(
    @InjectModel(ActionGroupProps.name)
    private actionGroupModel: ActionGroupModel,
    @InjectModel(ActionProps.name)
    private actionModel: ActionModel,
    private wordService: WordService,
  ) {}

  async post(
    atd: AccessTokenDomain,
    dto: PostActionGroupDTO,
  ): Promise<ActionGroupDomain> {
    return ActionGroupDomain.post(atd, dto, this.actionGroupModel)
  }

  async postActionByActionGroup(
    atd: AccessTokenDomain,
    id: string,
  ): Promise<ActionGroupDomain> {
    const actionGroup = await this.getById(atd, id)
    return actionGroup.postAction(atd, this.actionModel)
  }

  async get(atd: AccessTokenDomain): Promise<ActionGroupIdsDomain> {
    return ActionGroupIdsDomain.fromMdb(atd, this.actionGroupModel)
  }

  async getById(
    atd: AccessTokenDomain,
    id: string,
  ): Promise<ActionGroupDomain> {
    if (id === ActionGroupFixedId.DailyPostWordChallenge) {
      const query = new GetWordQueryDTO()
      query.daysAgoUntilToday = 365 // shows only 365 days until today
      return ActionGroupDomain.fromWordChunk(
        atd,
        await this.wordService.get(atd, query),
      )
    }

    return ActionGroupDomain.fromId(
      atd,
      id,
      this.actionGroupModel,
      this.actionModel,
    )
  }
}
