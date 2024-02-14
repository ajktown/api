import { DomainRoot } from '../index.root'
import { ActionDomain } from './action.domain'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordChunkDomain } from '../word/word-chunk.domain'
import { ActionGroupFixedId } from '@/constants/action-group.const'
import { WordDomain } from '../word/word.domain'
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

export class ActionGroupDomain extends DomainRoot {
  private readonly props: IActionGroup
  private readonly domains: Map<string, WordDomain> // date and word domain

  private constructor(props: IActionGroup, domains: Map<string, WordDomain>) {
    super()
    this.props = props
    this.domains = domains
  }

  static fromMdb(doc: ActionGroupDoc): ActionGroupDomain {
    if (typeof doc !== 'object') throw new DataNotObjectError()
    const emptyMap = new Map<string, WordDomain>()
    return new ActionGroupDomain(
      {
        id: doc.id,
        name: doc.name,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      emptyMap,
    )
  }

  static fromWordChunk(
    atd: AccessTokenDomain,
    wordChunk: WordChunkDomain,
  ): ActionGroupDomain {
    const dateWordDomainMap = new Map<string, WordDomain>() // i.e) 2024-01-01 => WordDomain
    for (const wordDomain of wordChunk.wordDomains) {
      const date = timeHandler.getYYYYMMDD(
        wordDomain.toResDTO(atd).dateAdded,
        atd.timezone,
      )
      dateWordDomainMap.set(date, wordDomain)
    }

    const now = timeHandler.getToday(atd.timezone)
    return new ActionGroupDomain(
      {
        id: ActionGroupFixedId.DailyPostWordChallenge,
        name: ActionGroupFixedId.DailyPostWordChallenge,
        createdAt: now,
        updatedAt: now,
      },
      dateWordDomainMap,
    )
  }

  /** Create sharedResource just for the word */
  static async post(
    atd: AccessTokenDomain,
    dto: PostActionGroupDTO,
    model: ActionGroupModel,
  ): Promise<ActionGroupDomain> {
    try {
      const props: ActionGroupProps = {
        ownerId: atd.userId,
        name: dto.name,
      }
      return ActionGroupDomain.fromMdb(await new model(props).save())
    } catch {
      throw new BadRequestError(
        'Something went wrong while posting action group',
      )
    }
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
      const ad = this.domains.get(timeHandler.getYYYYMMDD(date, atd.timezone))
      if (ad) {
        actionsDerived.push(
          ActionDomain.fromWordDomain(atd, this.props.id, ad).toResDTO(
            fixedLevel,
          ),
        )
      } else {
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
      isTodayHandled,
      totalCount,
    }
  }
}
