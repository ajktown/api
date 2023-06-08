import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordDomain } from './word.domain'
import { WordModel } from '@/schemas/deprecated-word.schema'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { SupportDomain } from '../support/support.domain'
import { SupportModel } from '@/schemas/deprecated-supports.schema'
import { SemesterDomain } from '../semester/semester.domain'
import { getPaginationHandler } from '@/handlers/get-pagination.handler'
import { SemesterDetailsDomain } from '../semester/semester-details.domain'
import { GetWordsRes } from '@/responses/get-words.res'
import { GetWordIdsRes } from '@/responses/get-word-ids.res'

export class WordChunkDomain {
  private readonly atd: AccessTokenDomain
  private readonly words: WordDomain[]
  private readonly query: GetWordQueryDTO

  private constructor(
    atd: AccessTokenDomain,
    words: WordDomain[],
    query: GetWordQueryDTO,
  ) {
    this.atd = atd
    this.words = words
    this.query = query
  }

  get wordDomains(): WordDomain[] {
    return this.words
  }

  get semesterDomain(): SemesterDomain | undefined {
    if (!this.isSemesterOnlyQuery()) return undefined
    return SemesterDomain.fromSemesterCode(
      this.query.semester,
      this.atd,
      true,
    ).insertDetails(SemesterDetailsDomain.fromWordDomains(this.atd, this.words))
  }

  static async get(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
    wordModel: WordModel,
    supportModel: SupportModel,
    factory: GetWordQueryFactory,
  ): Promise<WordChunkDomain> {
    const newWordChunkDomain = new WordChunkDomain(
      atd,
      (
        await wordModel
          .find(
            factory.getFilter(atd, query),
            factory.getProjection(),
            factory.getOptions(query),
          )
          .exec()
      )
        .sort((a, b) => b.dateAdded - a.dateAdded)
        .sort((a, b) => b.sem - a.sem)
        .map((wordRaw) => WordDomain.fromMdb(wordRaw)),
      query,
    )

    await newWordChunkDomain.deleteSemesterIfEmptyQuery(supportModel)
    return newWordChunkDomain
  }

  private isSemesterOnlyQuery() {
    return (
      Object.keys(this.query).length === 1 && this.query.semester !== undefined
    )
  }

  /** Delete support from persistence if condition is met. This is an automatic update process and therefore is private */
  private async deleteSemesterIfEmptyQuery(supportModel: SupportModel) {
    // TODO: The condition here is not 100% accurate. But then
    // TODO: Deleting semester is not really important.
    if (this.isSemesterOnlyQuery()) return

    const semesterRemovedSupportDomain = (
      await SupportDomain.fromMdb(this.atd, supportModel)
    ).removeSemester(this.query.semester)
    await semesterRemovedSupportDomain.update(supportModel)
  }

  toResDTO(): GetWordsRes {
    const wordsRes = this.words.map((word) => word.toResDTO(this.atd))
    const { pagination, sliceFrom, sliceUntil } = getPaginationHandler(
      wordsRes,
      this.query,
    )
    return {
      pagination: pagination,
      semester: this.semesterDomain?.toResDTO(),
      words: wordsRes.slice(sliceFrom, sliceUntil),
    }
  }

  toGetWordIdsResDTO(): GetWordIdsRes {
    const wordIds = this.words.map((word) => word.id)
    const { pagination, sliceFrom, sliceUntil } = getPaginationHandler(
      wordIds,
      this.query,
    )
    return {
      pagination: pagination,
      semester: this.semesterDomain?.toResDTO(),
      wordIds: wordIds.slice(sliceFrom, sliceUntil),
    }
  }
}
