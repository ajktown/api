import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordDomain } from '../word/word.domain'
import { ISemester } from './index.interface'
import { SemesterDomain } from './semester.domain'

export class SemesterChunkDomain {
  private readonly semesterDomains: SemesterDomain[]

  private constructor(domains: SemesterDomain[]) {
    this.semesterDomains = domains
  }

  static fromWordDomains(wordDomains: WordDomain[], atd: AccessTokenDomain) {
    const codeSet = new Set<number>()
    wordDomains.forEach((word) => codeSet.add(word.toResDTO(atd).semester))
    const sortedCodes = Array.from(codeSet).sort((a, b) => a - b)

    return new SemesterChunkDomain(
      sortedCodes.map((code) => SemesterDomain.fromSemesterCode(code, atd)),
    )
  }

  getSemesterById(id: string): SemesterDomain {
    const found = this.semesterDomains.find((e) => e.id === id)
    if (!found) throw new Error('Not found!')
    return found
  }

  toResDTO(): Array<Partial<ISemester>> {
    return this.semesterDomains.map((e) => e.toResDTO())
  }
}
