import { semesterLambda } from '@/lambdas/semester.lambda'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ISemester, ISemesterDetailedInfo } from './index.interface'
import { SemesterDetailsDomain } from './semester-details.domain'

export class SemesterDomain {
  private readonly props: Partial<ISemester>
  private details: undefined | ISemesterDetailedInfo

  /** Build and return unique id of semester */
  // As semester is not individually stored in DB, the id is backend generated.
  private buildIdConstructor(atd: AccessTokenDomain, semesterCode: number) {
    return `${atd.userId}-${semesterCode}`
  }

  private constructor(atd: AccessTokenDomain, props: Partial<ISemester>) {
    this.props = {
      id: this.buildIdConstructor(atd, props.code),
      ...props,
    }
  }

  get semester() {
    return this.props.code
  }

  /** Create semester domain  */
  static fromSemesterCode(
    semesterCode: number,
    atd: AccessTokenDomain,
    isExistInDb = false,
  ) {
    const { year, quarter } = semesterLambda.toYearAndQuarter(semesterCode)
    return new SemesterDomain(atd, {
      code: semesterCode,
      year,
      quarter,
      isExistInDb,
    })
  }

  toResDTO(): Partial<ISemester> {
    return {
      ...this.props,
      details: this.details,
    }
  }

  insertDetails(detailsDomain: SemesterDetailsDomain): this {
    this.details = detailsDomain.toDetails()
    return this
  }
}
