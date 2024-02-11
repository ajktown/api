import { DomainRoot } from '../index.root'
import { ActionDomain } from './action.domain'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordChunkDomain } from '../word/word-chunk.domain'
import { ActionGroupFixedIdSuffix } from '@/constants/action-group.const'

export class ActionGroupDomain extends DomainRoot {
  private readonly domains: ActionDomain[]

  private constructor(domains: ActionDomain[]) {
    super()
    this.domains = domains
  }

  static fromWordChunk(
    atd: AccessTokenDomain,
    wordChunk: WordChunkDomain,
  ): ActionGroupDomain {
    // 2024 only, create an empty action domains
    const groupId = atd.userId + ActionGroupFixedIdSuffix.PostWordConsistency

    return new ActionGroupDomain(
      wordChunk.wordDomains.map((wordDomain) =>
        wordDomain.toActionDomain(atd, groupId),
      ),
    )
  }
}
