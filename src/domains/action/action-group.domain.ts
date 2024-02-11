import { DomainRoot } from '../index.root'
import { ActionDomain } from './action.domain'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordChunkDomain } from '../word/word-chunk.domain'
import { ActionGroupFixedIdSuffix } from '@/constants/action-group.const'
import { WordDomain } from '../word/word.domain'
import { timeHandler } from '@/handlers/time.handler'

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
        timeHandler.getYYYYMMDD(new Date(), atd.timezone),
    )
    // total counts is number of actions committed that is at least level 1 or higher
    this.totalCount = domains.filter((d) => d.toResDTO().level).length
  }

  static fromWordChunk(
    atd: AccessTokenDomain,
    wordChunk: WordChunkDomain,
  ): ActionGroupDomain {
    const groupId = atd.userId + ActionGroupFixedIdSuffix.PostWordConsistency

    // 2024 only, create an empty action domains
    const dateWordDomainMap = new Map<string, WordDomain>() // i.e) 2024-01-01 => WordDomain
    for (const wordDomain of wordChunk.wordDomains) {
      const date = timeHandler.getYYYYMMDD(
        wordDomain.toResDTO(atd).dateAdded,
        atd.timezone,
      )
      dateWordDomainMap.set(date, wordDomain)
    }

    const startDate = new Date(`2024-01-01`)
    const endDate = new Date(`2024-12-31`)

    const actionDomains: ActionDomain[] = []

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = timeHandler.getYYYYMMDD(d, atd.timezone)
      if (dateWordDomainMap.has(date)) {
        actionDomains.push(
          dateWordDomainMap.get(date).toActionDomain(atd, groupId),
        )
      } else {
        actionDomains.push(ActionDomain.fromEmpty(atd, groupId, d))
      }
    }

    return new ActionGroupDomain(atd, actionDomains)
  }
}
