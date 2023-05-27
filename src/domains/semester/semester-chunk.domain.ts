import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordDomain } from '../word/word.domain'
import { GetSemestersResDTO } from './index.interface'
import { SemesterDomain } from './semester.domain'

export class SemesterChunkDomain {
  private readonly semesterDomains: SemesterDomain[]

  private constructor(domains: SemesterDomain[]) {
    this.semesterDomains = domains
  }

  static fromWordDomains(wordDomains: WordDomain[], atd: AccessTokenDomain) {
    const codeSet = new Set<number>()
    wordDomains.forEach((word) => codeSet.add(word.toResDTO(atd).semester))
    const sortedCodes = Array.from(codeSet)
      .sort((a, b) => a - b)
      .filter((el) => Number.isInteger(el)) // Just in case if there is a non-integer value for semester

    return new SemesterChunkDomain(
      sortedCodes.map((code) => SemesterDomain.fromSemesterCode(code, atd)),
    )
  }

  getSemesterByCode(code: number): SemesterDomain {
    const found = this.semesterDomains.find((e) => e.semester === code)
    if (!found) throw new Error('Not found!')
    return found
  }

  toResDTO(): GetSemestersResDTO {
    if (this.semesterDomains.length === 0) {
      return {
        latestSemesterCode: undefined,
        semesters: [],
      }
    }
    const sortedSemestersRes = this.semesterDomains
      .sort((a, b) => b.semester - a.semester)
      .map((e) => e.toResDTO())
    return {
      latestSemesterCode: sortedSemestersRes[0].code,
      semesters: sortedSemestersRes,
    }
  }
}
