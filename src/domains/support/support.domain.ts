import { Model } from 'mongoose'
import { ISupport } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import {
  DeprecatedSupportSchemaProps,
  DeprecatedSupportsDocument,
} from '@/schemas/deprecated-supports.schema'
import { DeprecatedWordDocument } from '@/schemas/deprecated-word.schema'

export class SupportDomain {
  private readonly props: Partial<ISupport>

  private constructor(props: Partial<ISupport>) {
    if (!props) throw new Error('No userId (OwnerID)!')

    this.props = props
  }

  get id() {
    return this.props.id
  }

  static fromMdb(
    props: DeprecatedSupportsDocument[],
    atd: AccessTokenDomain,
  ): SupportDomain {
    if (props.length > 2) throw new Error('Too many data!')

    // If no data found, it means the user has never created word.
    // Support will be automatically created when user creates his/her first word.
    if (props.length === 0) {
      return new SupportDomain({
        id: atd.userId + 'temporary_support_id',
        userId: atd.userId,
        semesters: [],
        newWordCount: 0,
        deletedWordCount: 0,
      })
    }

    return new SupportDomain({
      id: props[0].id,
      userId: props[0].ownerID,
      semesters: props[0].sems,
      newWordCount: props[0].newWordCnt,
      deletedWordCount: props[0].deletedWordCnt,
    })
  }

  updateWithWordDoc(document: DeprecatedWordDocument): this {
    if (document.ownerID !== this.props.userId) {
      throw new Error('No access')
    }

    const newSemesters = new Set(this.props.semesters)
    newSemesters.add(document.sem)

    this.props.semesters = Array.from(newSemesters)
    this.props.newWordCount += 1

    return this
  }

  /** Removes given semester within the support */
  removeSemester(semester: number | string): this {
    const newSemesters = new Set(this.props.semesters)
    newSemesters.delete(
      typeof semester === 'number' ? semester : parseInt(semester),
    )
    this.props.semesters = Array.from(newSemesters)

    return this
  }

  toMdbUpdate() {
    return {
      // ownerID: this.props.userId,
      sems: this.props.semesters,
      newWordCnt: this.props.newWordCount,
      deletedWordCnt: this.props.deletedWordCount,
    }
  }

  toDocument(deprecatedSupportModel: Model<DeprecatedSupportsDocument>) {
    const docProps: DeprecatedSupportSchemaProps = {
      ownerID: this.props.userId,
      sems: this.props.semesters,
      newWordCnt: this.props.newWordCount,
      deletedWordCnt: this.props.deletedWordCount,
    }
    return new deprecatedSupportModel(docProps)
  }

  toResDTO(atd: AccessTokenDomain): Partial<ISupport> {
    if (atd.userId !== this.props.userId) {
      throw new Error('No access')
    }

    return {
      id: this.props.id,
      userId: this.props.userId,
      semesters: this.props.semesters,
      newWordCount: this.props.newWordCount,
      deletedWordCount: this.props.deletedWordCount,
    }
  }
}
