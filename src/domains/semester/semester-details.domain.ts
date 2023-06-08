import { GlobalLanguageCode } from '@/global.interface'
import { ISemesterDetailedInfo } from './index.interface'
import { timeHandler } from '@/handlers/time.handler'
import { WordDomain } from '../word/word.domain'
import { AccessTokenDomain } from '../auth/access-token.domain'

export class SemesterDetailsDomain {
  private readonly props: ISemesterDetailedInfo

  private constructor(props: ISemesterDetailedInfo) {
    this.props = props
  }

  static fromWordDomains(atd: AccessTokenDomain, wordDomains: WordDomain[]) {
    const wordIdsSet = new Set<string>()
    const daysAgoSet = new Set<number>()
    const languagesSet = new Set<GlobalLanguageCode>()
    const tagsSet = new Set<string>()

    wordDomains.forEach((w) => {
      const word = w.toResDTO(atd)
      word.id && wordIdsSet.add(word.id)
      word.createdAt && daysAgoSet.add(timeHandler.getDaysAgo(word.createdAt))
      word.languageCode && languagesSet.add(word.languageCode)
      word.tags.forEach((tag) => tagsSet.add(tag))
    })

    return new SemesterDetailsDomain({
      wordsTotalCount: wordIdsSet.size,
      daysAgo: Array.from(daysAgoSet),
      languages: Array.from(languagesSet),
      tags: Array.from(tagsSet),
    })
  }

  toDetails(): ISemesterDetailedInfo {
    return this.props
  }
}
