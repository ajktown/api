import { semesterLambda } from '@/lambdas/semester.lambda'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { ISemester, ISemesterDetailedInfo } from './index.interface'
import { SemesterDetailsDomain } from './semester-details.domain'

export class SemesterDomain {
  private readonly props: Partial<ISemester>
  private details: undefined | ISemesterDetailedInfo

  private constructor(props: Partial<ISemester>) {
    this.props = props
  }

  get id() {
    return this.props.code.toString()
  }

  get semester() {
    return this.props.code
  }

  /** Build and return unique id of semester */
  static buildId(semesterCode: number, atd: AccessTokenDomain) {
    return `${atd.userId}-${semesterCode}`
  }

  static fromSemesterCode(semesterCode: number, atd: AccessTokenDomain) {
    const { year, quarter } = semesterLambda.toYearAndQuarter(semesterCode)
    return new SemesterDomain({
      id: this.buildId(semesterCode, atd),
      code: semesterCode,
      year,
      quarter,
    })
  }

  toResDTO(): Partial<ISemester> {
    return {
      id: this.id,
      ...this.props,
      details: this.details,
    }
  }

  insertDetails(detailsDomain: SemesterDetailsDomain): this {
    this.details = detailsDomain.toDetails()
    return this
  }
}
