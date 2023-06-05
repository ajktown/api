import { AccessTokenDomain } from '../auth/access-token.domain'
import { SupportDomain } from '../support/support.domain'
import { GetSemestersResDTO } from './index.interface'
import { SemesterDomain } from './semester.domain'

export class SemesterChunkDomain {
  private readonly semesterDomains: SemesterDomain[]

  private constructor(domains: SemesterDomain[]) {
    this.semesterDomains = domains
  }

  static fromSupportDomain(
    supportDomain: SupportDomain,
    atd: AccessTokenDomain,
  ) {
    const { semesters } = supportDomain.toResDTO(atd)
    const sortedCodes = Array.from(new Set(semesters)).sort((a, b) => a - b)

    return new SemesterChunkDomain(
      sortedCodes.map((code) =>
        SemesterDomain.fromSemesterCode(code, atd, true),
      ),
    )
  }

  /** Returns semester if found; else returns empty semester that does not exist in DB */
  getSemesterByCode(code: number, atd: AccessTokenDomain): SemesterDomain {
    return (
      this.semesterDomains.find((e) => e.semester === code) ||
      SemesterDomain.fromSemesterCode(code, atd)
    )
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
