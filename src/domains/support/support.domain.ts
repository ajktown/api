import { ISupport } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import {
  SupportProps,
  SupportModel,
  SupportDoc,
} from '@/schemas/deprecated-supports.schema'
import { WordDomain } from '../word/word.domain'
import { UpdateForbiddenError } from '@/errors/403/action_forbidden_errors/update-forbidden.error'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { BadRequestError } from '@/errors/400/index.error'
import { DataNotPresentError } from '@/errors/400/data-not-present.error'
import { DeleteForbiddenError } from '@/errors/403/action_forbidden_errors/delete-forbidden.error'

export class SupportDomain {
  private readonly props: Partial<ISupport>

  private constructor(props: Partial<ISupport>) {
    if (!props.userId) throw new DataNotPresentError('User ID')

    this.props = props
  }

  get id() {
    return this.props.id
  }

  /** Returns SupportDomain from MongoDB. It also creates SupportDomain if it doesn't exist. */
  static async fromMdbByAtd(
    atd: AccessTokenDomain,
    model: SupportModel,
    avoidRecursiveCall = false,
  ): Promise<SupportDomain> {
    const supportDocs = await model.find({ ownerID: atd.userId }).exec()
    if (avoidRecursiveCall && supportDocs.length !== 1) {
      throw new BadRequestError(
        'Something went really wrong while creating support',
      )
    }

    if (supportDocs.length > 1) {
      // TODO: Write a logger
      for await (const doc of supportDocs.slice(1)) {
        await SupportDomain.fromMdb(doc).delete(atd, model)
      }
    }

    if (!avoidRecursiveCall && supportDocs.length === 0) {
      const temp = new SupportDomain({
        id: atd.userId + 'temporary_support_id',
        userId: atd.userId,
        semesters: [],
        newWordCount: 0,
        deletedWordCount: 0,
      })

      await temp.toDoc(model).save()
      return this.fromMdbByAtd(atd, model, true)
    }

    return SupportDomain.fromMdb(supportDocs[0])
  }

  static fromMdb(doc: SupportDoc): SupportDomain {
    return new SupportDomain({
      id: doc.id,
      userId: doc.ownerID,
      semesters: doc.sems,
      newWordCount: doc.newWordCnt,
      deletedWordCount: doc.deletedWordCnt,
    })
  }

  /** Removes given semester within the support */
  removeSemester(semester: number): this {
    const newSemesters = new Set(this.props.semesters)
    newSemesters.delete(semester)
    this.props.semesters = Array.from(newSemesters)

    return this
  }

  toDoc(supportModel: SupportModel): SupportDoc {
    const docProps: SupportProps = {
      ownerID: this.props.userId,
      sems: this.props.semesters,
      newWordCnt: this.props.newWordCount,
      deletedWordCnt: this.props.deletedWordCount,
    }
    return new supportModel(docProps)
  }

  toResDTO(atd: AccessTokenDomain): Partial<ISupport> {
    if (atd.userId !== this.props.userId)
      throw new ReadForbiddenError(atd, `Support`)

    return {
      id: this.props.id,
      userId: this.props.userId,
      semesters: this.props.semesters,
      newWordCount: this.props.newWordCount,
      deletedWordCount: this.props.deletedWordCount,
    }
  }

  async update(model: SupportModel) {
    return model.findByIdAndUpdate(
      this.props.id,
      {
        // ownerID: this.props.userId, // ownerId should not be modified
        sems: this.props.semesters,
        newWordCnt: this.props.newWordCount,
        deletedWordCnt: this.props.deletedWordCount,
      },
      { upsert: true },
    )
  }

  updateWithPostedWord(
    atd: AccessTokenDomain,
    newlyPostedWordDomain: WordDomain,
  ): this {
    const props = newlyPostedWordDomain.toResDTO(atd)
    if (props.userId !== this.props.userId) {
      throw new UpdateForbiddenError(atd, `Word`)
    }

    const newSemesters = new Set(this.props.semesters)
    newSemesters.add(props.semester)

    this.props.semesters = Array.from(newSemesters)
    this.props.newWordCount += 1

    return this
  }

  async updateWithDeletedWord(model: SupportModel): Promise<this> {
    this.props.deletedWordCount += 1
    await this.update(model)
    return this
  }

  async delete(atd: AccessTokenDomain, model: SupportModel): Promise<void> {
    if (atd.userId !== this.props.userId) {
      throw new DeleteForbiddenError(atd, `Support`)
    }

    await model.findByIdAndDelete(this.props.id).exec()
  }
}
