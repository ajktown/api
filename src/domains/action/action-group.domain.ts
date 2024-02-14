import { DomainRoot } from '../index.root'
import { ActionDomain } from './action.domain'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordChunkDomain } from '../word/word-chunk.domain'
import { ActionGroupFixedId } from '@/constants/action-group.const'
import { timeHandler } from '@/handlers/time.handler'
import { PostActionGroupDTO } from '@/dto/post-action-group.dto'
import {
  ActionGroupDoc,
  ActionGroupModel,
  ActionGroupProps,
} from '@/schemas/action-group.schema'
import { BadRequestError } from '@/errors/400/index.error'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { IActionDerived, IActionGroup } from './index.interface'
import { GetActionGroupRes } from '@/responses/get-action-groups.res'
import { ActionDoc, ActionModel, ActionProps } from '@/schemas/action.schema'
import { NotExistOrNoPermissionError } from '@/errors/400/not-exist-or-no-permission.error'

/**
 * ActionGroupDomain first contains only level 1~4 data.
 * The level 0 (or does not exist) in the first place does not exist
 * When toRes() is run, the 0s will be filled with EmptyActionDomain to make it for FE to consume easily.
 */
export class ActionGroupDomain extends DomainRoot {
  private readonly props: IActionGroup
  private readonly dateDomainMap: Map<string, ActionDomain> // date and action domain

  private constructor(
    props: IActionGroup,
    dateDomainMap: Map<string, ActionDomain>,
  ) {
    super()
    this.props = props
    this.dateDomainMap = dateDomainMap
  }

  get id() {
    return this.props.id
  }

  private static fromMdb(
    doc: ActionGroupDoc,
    map: Map<string, ActionDomain>,
  ): ActionGroupDomain {
    if (typeof doc !== 'object') throw new DataNotObjectError()
    return new ActionGroupDomain(
      {
        id: doc.id,
        name: doc.name,
        ownerId: doc.ownerId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      map,
    )
  }

  static async fromId(
    atd: AccessTokenDomain,
    id: string,
    model: ActionGroupModel,
    actionModel: ActionModel,
  ): Promise<ActionGroupDomain> {
    const doc = await model.findById(id).exec()
    if (!doc) throw new NotExistOrNoPermissionError()

    if (doc.ownerId !== atd.userId) throw new NotExistOrNoPermissionError()

    const map = new Map<string, ActionDomain>()
    const actionDocs = await actionModel.find({ groupId: id }).exec()
    for (const actionDoc of actionDocs) {
      const ad = ActionDomain.fromMdb(null, actionDoc)
      map.set(ad.yyyymmdd, ad)
    }
    return ActionGroupDomain.fromMdb(doc, map)
  }

  static fromWordChunk(
    atd: AccessTokenDomain,
    wordChunk: WordChunkDomain,
  ): ActionGroupDomain {
    const fixedId = ActionGroupFixedId.DailyPostWordChallenge

    const dateWordDomainMap = new Map<string, ActionDomain>() // i.e) 2024-01-01 => ActionDomain
    for (const wordDomain of wordChunk.wordDomains) {
      const ad = ActionDomain.fromWordDomain(atd, fixedId, wordDomain)
      dateWordDomainMap.set(ad.yyyymmdd, ad)
    }
    const now = timeHandler.getToday(atd.timezone)
    return new ActionGroupDomain(
      {
        id: fixedId,
        ownerId: atd.userId,
        name: fixedId,
        createdAt: now,
        updatedAt: now,
      },
      dateWordDomainMap,
    )
  }

  static async post(
    atd: AccessTokenDomain,
    dto: PostActionGroupDTO,
    model: ActionGroupModel,
  ): Promise<ActionGroupDomain> {
    let docs: ActionGroupDoc[] = []
    try {
      docs = await model
        .find({
          ownerId: atd.userId,
          name: dto.name,
        })
        .exec()
    } catch (err) {
      throw new BadRequestError('Something went wrong')
    }
    if (docs.length) throw new BadRequestError('The name already exists')

    try {
      const props: ActionGroupProps = {
        ownerId: atd.userId,
        name: dto.name,
      }
      const emptyMap = new Map<string, ActionDomain>()
      return ActionGroupDomain.fromMdb(await new model(props).save(), emptyMap)
    } catch {
      throw new BadRequestError(
        'Something went wrong while posting action group',
      )
    }
  }

  async postAction(
    atd: AccessTokenDomain,
    actionModel: ActionModel,
  ): Promise<this> {
    // if today's action exists, throw error
    let docs: ActionDoc[] = []
    try {
      docs = await actionModel.find({
        ownerId: this.props.ownerId,
        groupId: this.props.id,
        createdAt: {
          $gte: timeHandler.getStartOfToday(atd.timezone),
        },
      })
    } catch (err) {
      throw new BadRequestError(err)
    }
    if (docs.length)
      throw new BadRequestError('You already have action for today')

    // Create it if passed:
    const docProps: ActionProps = {
      ownerId: this.props.ownerId,
      groupId: this.props.id,
    }
    const actionDomain = ActionDomain.fromMdb(
      atd,
      await new actionModel(docProps).save(),
    )
    // update into the map
    this.dateDomainMap.set(actionDomain.yyyymmdd, actionDomain)
    return this
  }

  toResDTO(atd: AccessTokenDomain): GetActionGroupRes {
    const [start, end] = timeHandler.getDateFromDaysAgoUntilToday(
      365 - 1, // today is inclusive, so 365 - 1
      atd.timezone,
    )

    const actionsDerived: IActionDerived[] = []
    const fixedLevel = 4 // level 4 is fixed atm

    for (
      let date = start;
      date <= end;
      date = timeHandler.getNextDate(date, atd.timezone)
    ) {
      const ad = this.dateDomainMap.get(
        timeHandler.getYYYYMMDD(date, atd.timezone),
      )
      if (ad) actionsDerived.push(ad.toResDTO(fixedLevel))
      else {
        actionsDerived.push(
          ActionDomain.fromEmpty(atd, this.props.id, date).toResDTO(0),
        )
      }
    }

    // isTodayHandled
    const isTodayHandled = actionsDerived.some(
      (ad) =>
        timeHandler.getYYYYMMDD(ad.createdAt, atd.timezone) ===
          timeHandler.getYYYYMMDD(new Date(), atd.timezone) && 0 < ad.level,
    )
    // total counts is number of actions committed that is at least level 1 or higher
    const totalCount = actionsDerived.filter((d) => d.level).length

    return {
      props: this.props,
      actions: actionsDerived,
      actionsLength: actionsDerived.length,
      isTodayHandled,
      totalCount,
    }
  }
}
