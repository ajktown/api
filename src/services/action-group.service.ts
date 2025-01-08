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
import { PostActionBodyDTO } from '@/dto/post-action.dto'
import { PostArchiveActionGroupBodyDTO } from '@/dto/post-archived-action-group.dto'
import { ArchiveModel, ArchiveProps } from '@/schemas/archive.schema'
import { ArchiveDomain } from '@/domains/archive/archive.domain'

@Injectable()
export class ActionGroupService {
  constructor(
    @InjectModel(ActionGroupProps.name)
    private readonly actionGroupModel: ActionGroupModel,
    @InjectModel(ArchiveProps.name)
    private readonly archiveModel: ArchiveModel,
    @InjectModel(ActionProps.name)
    private readonly actionModel: ActionModel,
    private readonly wordService: WordService,
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
    dto: PostActionBodyDTO,
  ): Promise<ActionGroupDomain> {
    const actionGroup = await this.getById(atd, id)
    return actionGroup.postAction(atd, dto, this.actionModel)
  }

  async archiveActionGroup(
    atd: AccessTokenDomain,
    id: string,
    dto: PostArchiveActionGroupBodyDTO,
  ): Promise<void> {
    await ArchiveDomain.archiveActionGroup(
      atd,
      id,
      dto,
      this.actionGroupModel,
      this.archiveModel,
    )
  }

  async getByUser(id: string): Promise<ActionGroupDomain> {
    return ActionGroupDomain.fromId(id, this.actionGroupModel, this.actionModel)
  }

  async getById(
    nullableAtd: null | AccessTokenDomain,
    id: string,
  ): Promise<ActionGroupDomain> {
    if (id === ActionGroupFixedId.DailyPostWordChallenge) {
      const query = new GetWordQueryDTO()
      query.daysAgoUntilToday = 365 // shows only 365 days until today
      return ActionGroupDomain.fromWordChunk(
        nullableAtd,
        await this.wordService.get(nullableAtd, query),
      )
    }

    return ActionGroupDomain.fromId(id, this.actionGroupModel, this.actionModel)
  }

  /**
   * Delete every actions associated to the action group that is TODAY!
   */
  async deleteTodayAction(
    atd: AccessTokenDomain,
    actionGroupId: string,
  ): Promise<ActionGroupDomain> {
    const actionGroup = await this.getById(atd, actionGroupId)
    return actionGroup.deleteAction(atd, this.actionModel, 'today')
  }

  /**
   * Delete every actions associated to the action group that is YESTERDAY!
   * This is developed as some users want to make the CGT records correct for all the time.
   */
  async deleteYesterdayAction(
    atd: AccessTokenDomain,
    actionGroupId: string,
  ): Promise<ActionGroupDomain> {
    const actionGroup = await this.getById(atd, actionGroupId)
    return actionGroup.deleteAction(atd, this.actionModel, 'yesterday')
  }
}
