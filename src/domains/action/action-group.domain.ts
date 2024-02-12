import { DomainRoot } from '../index.root'
import { ActionDomain } from './action.domain'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordChunkDomain } from '../word/word-chunk.domain'
import { ActionGroupFixedIdSuffix } from '@/constants/action-group.const'
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

export class ActionGroupDomain extends DomainRoot {
  private readonly isTodayHandled: boolean
  private readonly totalCount: number
  private readonly domains: ActionDomain[]

  private constructor(atd: AccessTokenDomain, domains: ActionDomain[]) {
    super()
    this.domains = domains
    // isTodayHandled
    this.isTodayHandled = domains.some(
      (d) =>
        timeHandler.getYYYYMMDD(d.toResDTO().createdAt, atd.timezone) ===
          timeHandler.getYYYYMMDD(new Date(), atd.timezone) &&
        0 < d.toResDTO().level,
    )
    // total counts is number of actions committed that is at least level 1 or higher
    this.totalCount = domains.filter((d) => d.toResDTO().level).length
  }

  static fromMdb(
    atd: AccessTokenDomain,
    doc: ActionGroupDoc,
  ): ActionGroupDomain {
    if (typeof doc !== 'object') throw new DataNotObjectError()
    return new ActionGroupDomain(atd, [])
  }

  static fromWordChunk(
    atd: AccessTokenDomain,
    wordChunk: WordChunkDomain,
  ): ActionGroupDomain {
    const groupId = atd.userId + ActionGroupFixedIdSuffix.PostWordConsistency

    const dateWordDomainMap = new Map<string, WordDomain>() // i.e) 2024-01-01 => WordDomain
    for (const wordDomain of wordChunk.wordDomains) {
      const date = timeHandler.getYYYYMMDD(
        wordDomain.toResDTO(atd).dateAdded,
        atd.timezone,
      )
      dateWordDomainMap.set(date, wordDomain)
    }

    const [start, end] = timeHandler.getDateFromDaysAgoUntilToday(
      365 - 1, // today is inclusive, so 365 - 1
      atd.timezone,
    )

    const actionDomains: ActionDomain[] = []
    for (
      let date = start;
      date <= end;
      date = timeHandler.getNextDate(date, atd.timezone)
    ) {
      const wordDomain = dateWordDomainMap.get(
        timeHandler.getYYYYMMDD(date, atd.timezone),
      )
      if (wordDomain) {
        actionDomains.push(
          ActionDomain.fromWordDomain(atd, groupId, wordDomain),
        )
      } else {
        actionDomains.push(ActionDomain.fromEmpty(atd, groupId, date))
      }
    }

    return new ActionGroupDomain(atd, actionDomains)
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
      return ActionGroupDomain.fromMdb(atd, await new model(props).save())
    } catch {
      throw new BadRequestError(
        'Something went wrong while posting action group',
      )
    }
  }
}
