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
import {
  IActionDerived,
  IActionGroup,
  IActionGroupInput,
} from './index.interface'
import {
  ActionGroupState,
  ActionGroupStateCommitment,
  ActionGroupStateTime,
  GetActionGroupRes,
} from '@/responses/get-action-groups.res'
import { ActionDoc, ActionModel, ActionProps } from '@/schemas/action.schema'
import { NotExistOrNoPermissionError } from '@/errors/404/not-exist-or-no-permission.error'
import { SupportedTimeZoneConst } from '@/constants/time-zone.const'
import { NumberNotInRangeError } from '@/errors/400/index.num-not-in-range.error'
import { PostActionBodyDTO } from '@/dto/post-action.dto'
import { DataNotSelectableError } from '@/errors/400/data-not-selectable.error'

/**
 * ActionGroupDomain first contains only level 1~4 data.
 * The level 0 (or does not exist) in the first place does not exist
 * When toRes() is run, the 0s will be filled with EmptyActionDomain to make it for FE to consume easily.
 */
export class ActionGroupDomain extends DomainRoot {
  private readonly props: IActionGroup
  private readonly dateDomainMap: Map<string, ActionDomain> // date and action domain

  private constructor(
    props: IActionGroupInput,
    dateDomainMap: Map<string, ActionDomain>,
  ) {
    super()

    if (props.openMinsAfter < 0 || 1439 < props.openMinsAfter)
      throw new NumberNotInRangeError(
        'openMinsAfter',
        props.openMinsAfter,
        0,
        1439,
      )

    if (props.closeMinsBefore < 1 || 1440 < props.closeMinsBefore)
      throw new NumberNotInRangeError(
        'closeMinsBefore',
        props.closeMinsBefore,
        1,
        1440,
      )

    if (!SupportedTimeZoneConst.has(props.timezone))
      throw new BadRequestError('Unsupported timezone')

    if (props.task.length < 1) throw new BadRequestError('Task is too short')

    const [openAt, closeAt] = timeHandler.getTodayRangeByMins(
      props.timezone,
      props.openMinsAfter,
      props.closeMinsBefore,
    )
    this.props = {
      ...props,
      firstYear: timeHandler.getYear(props.createdAt, props.timezone),
      openAt,
      closeAt,
      utc: '+9:00', // TODO: Get it from props.timezone. I dont know how at this point
    }
    this.dateDomainMap = dateDomainMap
  }

  get id() {
    return this.props.id
  }

  private get stateTime(): ActionGroupStateTime {
    const now = new Date()
    if (now.valueOf() < this.props.openAt.valueOf()) return 'Early'
    if (now.valueOf() < this.props.closeAt.valueOf()) return 'OnTime'
    return 'Late'
  }

  private get stateCommitment(): ActionGroupStateCommitment {
    const now = new Date()
    const got = this.dateDomainMap.get(
      timeHandler.getYYYYMMDD(now, this.props.timezone),
    )

    if (got === undefined) return `NotCommitted`
    if (got.toResDTO(0).isDummy) return `DummyCommitted`
    return `Committed`
  }

  get state(): ActionGroupState {
    return (this.stateTime + this.stateCommitment) as ActionGroupState
  }

  get isOnTimeCommittable(): boolean {
    // Since it is "OnTimeNotCommitted", meaning not committed yet, it is committable:
    return this.state === `OnTimeNotCommitted`
  }

  get isDummyCommittable(): boolean {
    return [
      `EarlyNotCommitted`,
      `OnTimeNotCommitted`,
      // `LateNotCommitted`, => If it is late, even dummy should not be committed, and is more of isLateCommittable==true
    ].includes(this.state)
  }

  get isLateCommittable(): boolean {
    return this.state === `LateNotCommitted`
  }

  get isDeletable(): boolean {
    return [
      `EarlyCommitted`,
      `EarlyDummyCommitted`,
      `OnTimeCommitted`,
      `OnTimeDummyCommitted`,
      `LateCommitted`,
      `LateDummyCommitted`,
    ].includes(this.state)
  }

  private static fromMdb(
    doc: ActionGroupDoc,
    map: Map<string, ActionDomain>,
  ): ActionGroupDomain {
    if (typeof doc !== 'object') throw new DataNotObjectError()
    return new ActionGroupDomain(
      {
        id: doc.id,
        ownerId: doc.ownerId,
        task: doc.task,
        timezone: doc.timezone,
        openMinsAfter: doc.openMinsAfter,
        closeMinsBefore: doc.closeMinsAfter,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      map,
    )
  }

  static async fromId(
    id: string,
    model: ActionGroupModel,
    actionModel: ActionModel,
  ): Promise<ActionGroupDomain> {
    const doc = await model.findById(id).exec()
    if (!doc) throw new NotExistOrNoPermissionError()

    const map = new Map<string, ActionDomain>()
    const actionDocs = await actionModel.find({ groupId: id }).exec()

    for (const actionDoc of actionDocs) {
      const ad = ActionDomain.fromMdb(doc.timezone, actionDoc)
      map.set(ad.yyyymmdd, ad)
    }
    return ActionGroupDomain.fromMdb(doc, map)
  }

  static fromWordChunk(
    nullableAtd: null | AccessTokenDomain,
    wordChunk: WordChunkDomain,
  ): ActionGroupDomain {
    if (!nullableAtd) throw new NotExistOrNoPermissionError()

    const fixedTimeZone = 'Asia/Seoul' // TODO: Don't fix it.
    const fixedId = ActionGroupFixedId.DailyPostWordChallenge

    const dateWordDomainMap = new Map<string, ActionDomain>() // i.e) 2024-01-01 => ActionDomain
    for (const wordDomain of wordChunk.wordDomains) {
      const ad = ActionDomain.fromWordDomain(fixedId, fixedTimeZone, wordDomain)
      dateWordDomainMap.set(ad.yyyymmdd, ad)
    }
    const now = timeHandler.getToday(fixedTimeZone)
    return new ActionGroupDomain(
      {
        id: fixedId,
        ownerId: nullableAtd.userId,
        task: 'Post at least a word a day challenge',
        timezone: fixedTimeZone,
        openMinsAfter: 0,
        closeMinsBefore: 1440,
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
    if (dto.closeMinsAfter <= dto.openMinsAfter) {
      // otherwise action group will be closed all the time
      throw new BadRequestError(
        `closeMinsAfter must be bigger than openMinsAfter; got closeMinsAfter: ${dto.closeMinsAfter}, got openMinsAfter: ${dto.openMinsAfter} `,
      )
    }

    try {
      const props: ActionGroupProps = {
        ownerId: atd.userId,
        timezone: dto.timezone,
        task: dto.task,
        openMinsAfter: dto.openMinsAfter,
        closeMinsAfter: dto.closeMinsAfter,
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
    dto: PostActionBodyDTO,
    actionModel: ActionModel,
  ): Promise<this> {
    // check if is owned by the user
    if (this.props.ownerId !== atd.userId)
      throw new NotExistOrNoPermissionError()

    // if today's action exists, throw error
    let docs: ActionDoc[] = []
    try {
      docs = await actionModel.find({
        ownerId: this.props.ownerId,
        groupId: this.props.id,
        createdAt: {
          $gte: timeHandler.getStartOfToday(this.props.timezone),
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
      isDummy: dto.isDummy || false,
    }
    const actionDomain = ActionDomain.fromMdb(
      this.props.timezone,
      await new actionModel(docProps).save(),
    )
    // update into the map
    this.dateDomainMap.set(actionDomain.yyyymmdd, actionDomain)
    return this
  }

  /**
   * Delete every action associated to the action group that is TODAY or YESTERDAY!
   */
  async deleteAction(
    atd: AccessTokenDomain,
    model: ActionModel,
    which: 'today' | 'yesterday', // Only today or yesterday is allowed to be deleted
  ): Promise<this> {
    if (this.props.ownerId !== atd.userId)
      throw new NotExistOrNoPermissionError()

    const gte = (() => {
      switch (which) {
        case 'today':
          return timeHandler.getStartOfToday(this.props.timezone)
        case 'yesterday':
          return timeHandler.getStartOfYesterday(this.props.timezone)
        default:
          throw new DataNotSelectableError('which', ['today', 'yesterday'])
      }
    })()

    // get todays actions
    let docs: ActionDoc[] = []
    try {
      docs = await model.find({
        ownerId: this.props.ownerId,
        groupId: this.props.id,
        createdAt: {
          $gte: gte,
        },
      })
    } catch (err) {
      throw new BadRequestError(err)
    }

    if (docs.length === 0) throw new NotExistOrNoPermissionError()

    // delete docs
    for (const doc of docs) {
      await doc.deleteOne()
      this.dateDomainMap.delete(
        timeHandler.getYYYYMMDD(doc.createdAt, this.props.timezone),
      )
    }
    return this
  }

  toSharedResDTO(ownerId: string): GetActionGroupRes {
    // TODO: This is temporary
    if (this.props.ownerId !== ownerId) {
      throw new NotExistOrNoPermissionError()
    }

    const [start, end] = timeHandler.getDateFromDaysAgoUntilToday(
      365 - 1, // today is inclusive, so 365 - 1
      this.props.timezone,
    )

    const actionsDerived: IActionDerived[] = []
    let streak = 0 // To motivate users to keep the streak
    for (
      let date = start;
      date <= end;
      date = timeHandler.getNextDate(date, this.props.timezone)
    ) {
      const ad = this.dateDomainMap.get(
        timeHandler.getYYYYMMDD(date, this.props.timezone),
      )

      // action group assigns levels from the following logic:
      //
      // if no action committed in the first place, it is level 0:
      if (!ad) {
        // reset streak as it is not committed (BUT today is inclusive):
        if (date.valueOf() !== end.valueOf()) streak = 0

        actionsDerived.push(
          ActionDomain.fromEmpty(
            this.props.id,
            this.props.timezone,
            date,
          ).toResDTO(0),
        )
        continue
      }
      // if dummy, level 0:
      if (ad.isDummy) {
        streak = 0 // Dummy commit is considered no longer doable. So, reset streak.
        actionsDerived.push(ad.toResDTO(0))
        continue
      }

      // From now on, action is done despite it is late:
      streak += 1

      // if action committed but is late for that date, it is level 1:
      // make sure to subtract this.props.closeAt.valueOf() from the days behind
      // TODO: This is too complex, should have a good lambda or something.
      const calculatedClosingDateFromToday =
        this.props.closeAt.valueOf().valueOf() -
        timeHandler.getStartOfToday(this.props.timezone).valueOf()
      const [startOfDateThatAdCreatedAt] = timeHandler.getDateFromDaysAgo(
        timeHandler.getDaysAgo(ad.createdAtValue, this.props.timezone),
        this.props.timezone,
      )
      if (
        calculatedClosingDateFromToday + startOfDateThatAdCreatedAt.valueOf() <
        ad.createdAtValue
      ) {
        actionsDerived.push(ad.toResDTO(1))
        continue
      }

      // ideal: level 4
      actionsDerived.push(ad.toResDTO(4))
    }

    // isTodayHandled
    const isTodayHandled = actionsDerived.some(
      (ad) =>
        timeHandler.getYYYYMMDD(ad.createdAt, this.props.timezone) ===
          timeHandler.getYYYYMMDD(new Date(), this.props.timezone) &&
        0 < ad.level,
    )

    const isTimePassed = this.props.closeAt.valueOf() < new Date().valueOf()
    const isTodaySuccessful = () => {
      if (isTodayHandled) return true
      if (isTimePassed) return false
      return null
    }

    return {
      props: this.props,
      streak,
      actionsLength: actionsDerived.length,
      isTodayHandled,
      // total counts is number of actions committed that is at least level 1 or higher
      totalCount: actionsDerived.filter((d) => d.level).length,
      isPassed: isTimePassed,
      isOpened: timeHandler.isWithinDates(
        new Date(),
        this.props.openAt,
        this.props.closeAt,
      ),
      isTodaySuccessful: isTodaySuccessful(),
      state: this.state,
      actions: actionsDerived,
      derivedState: {
        isOnTimeCommittable: this.isOnTimeCommittable,
        isDummyCommittable: this.isDummyCommittable,
        isLateCommittable: this.isLateCommittable,
        isDeletable: this.isDeletable,
      },
    }
  }

  toResDTO(atd: AccessTokenDomain): GetActionGroupRes {
    return this.toSharedResDTO(atd.userId)
  }
}
