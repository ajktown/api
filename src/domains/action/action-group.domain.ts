import { DomainRoot } from '../index.root'
import { ActionDomain } from './action.domain'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordChunkDomain } from '../word/word-chunk.domain'
import { ActionGroupFixedIdSuffix } from '@/constants/action-group.const'
import { WordDomain } from '../word/word.domain'

export class ActionGroupDomain extends DomainRoot {
  private readonly totalCount: number
  private readonly domains: ActionDomain[]

  private constructor(domains: ActionDomain[]) {
    super()
    this.domains = domains
    // total counts is number of actions committed that is at least level 1 or higher
    this.totalCount = domains.filter(d => d.toResDTO().level).length
  }

  static fromWordChunk(
    atd: AccessTokenDomain,
    wordChunk: WordChunkDomain,
  ): ActionGroupDomain {
    const groupId = atd.userId + ActionGroupFixedIdSuffix.PostWordConsistency

    // 2024 only, create an empty action domains
    const dateWordDomainMap = new Map<string, WordDomain>() // i.e) 2024-01-01 => WordDomain
    for (const wordDomain of wordChunk.wordDomains) {
      const date = new Date(wordDomain.toResDTO(atd).dateAdded)
        .toISOString()
        .split(`T`)[0] // i.e) 2024-01-01
      dateWordDomainMap.set(date, wordDomain)
    }

    const startDate = new Date(`2024-01-01`)
    const endDate = new Date(`2024-12-31`)

    const actionDomains: ActionDomain[] = []

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split(`T`)[0] // i.e) 2024-01-01
      if (dateWordDomainMap.has(date)) {
        actionDomains.push(
          dateWordDomainMap.get(date).toActionDomain(atd, groupId),
        )
      } else {
        actionDomains.push(ActionDomain.fromEmpty(atd, groupId, d))
      }
    }

    return new ActionGroupDomain(actionDomains)
  }
}
