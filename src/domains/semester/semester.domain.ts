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

  insertDetails(detailsDomain: SemesterDetailsDomain): this {
    this.details = detailsDomain.toDetails()
    return this
  }

  // static fromPostReqDto(dto: PostWordBodyDTO): WordDomain {
  //   return new WordDomain({
  //     languageCode: dto.languageCode,
  //     semester: dto.semester,
  //     isFavorite: dto.isFavorite,
  //     term: dto.term,
  //     pronunciation: dto.pronunciation,
  //     definition: dto.definition,
  //     example: dto.example,
  //     tags: dto.tags,
  //   })
  // }

  // static fromMdb(props: DeprecatedWordDocument): WordDomain {
  //   if (typeof props !== 'object') throw new Error('Not Object!')

  //   return new WordDomain({
  //     id: props.id,
  //     languageCode: props.language as GlobalLanguageCode, // TODO: Write a type validator
  //     semester: props.sem,
  //     isFavorite: props.isFavorite,
  //     term: props.word,
  //     pronunciation: props.pronun,
  //     definition: props.meaning,
  //     example: props.example,
  //     tags: props.tag,
  //     createdAt: new Date(props.createdAt),
  //     updatedAt: new Date(props.createdAt),
  //   })
  // }

  // toDocument(deprecatedWordModel: Model<DeprecatedWordDocument>) {
  //   const docProps: DeprecatedWordSchemaProps = {
  //     language: this.props.languageCode,
  //     sem: this.props.semester,
  //     isFavorite: this.props.isFavorite,
  //     word: this.props.term,
  //     pronun: this.props.pronunciation,
  //     meaning: this.props.definition,
  //     example: this.props.example,
  //     tag: this.props.tags,
  //     ownerID: 'abc',
  //     // Deprecated Props (Not used below from Wordnote, or Wordy v2):
  //     reviewdOn: [],
  //     order: 1,
  //     step: 1,
  //     isPublic: true,
  //     dateAdded: new Date().valueOf(),
  //   }
  //   return new deprecatedWordModel(docProps)
  // }

  toResDTO(): Partial<ISemester> {
    return {
      id: this.id,
      ...this.props,
      details: this.details,
    }
  }
}
