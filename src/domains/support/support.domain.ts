import { Model } from 'mongoose'
import { ISupport } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import {
  DeprecatedSupportSchemaProps,
  DeprecatedSupportsDocument,
  SupportModel,
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

  /** Returns SupportDomain from MongoDB. It also creates SupportDomain if it doesn't exist. */
  static async fromMdb(
    atd: AccessTokenDomain,
    model: SupportModel,
    avoidRecursiveCall = false,
  ): Promise<SupportDomain> {
    const supportDocs = await model.find({ ownerID: atd.userId }).exec()
    if (avoidRecursiveCall && supportDocs.length !== 1) {
      throw new Error('Something went really wrong while creating support')
    }

    if (supportDocs.length > 2) throw new Error('Too much data!')

    if (!avoidRecursiveCall && supportDocs.length === 0) {
      const temp = new SupportDomain({
        id: atd.userId + 'temporary_support_id',
        userId: atd.userId,
        semesters: [],
        newWordCount: 0,
        deletedWordCount: 0,
      })

      await temp.toDocument(model).save()
      return this.fromMdb(atd, model, true)
    }

    return new SupportDomain({
      id: supportDocs[0].id,
      userId: supportDocs[0].ownerID,
      semesters: supportDocs[0].sems,
      newWordCount: supportDocs[0].newWordCnt,
      deletedWordCount: supportDocs[0].deletedWordCnt,
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

  async updateWithWordDeleted(model: SupportModel): Promise<this> {
    this.props.deletedWordCount += 1
    await model.findByIdAndUpdate(this.props.id, this.toMdbUpdate())
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
