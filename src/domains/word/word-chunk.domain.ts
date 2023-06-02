import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { WordDomain } from './word.domain'
import { WordModel } from '@/schemas/deprecated-word.schema'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { SupportDomain } from '../support/support.domain'
import { SupportModel } from '@/schemas/deprecated-supports.schema'
import { IWord } from './index.interface'

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
        await wordModel.find(
          factory.getFilter(atd, query),
          factory.getProjection(),
          factory.getOptions(query),
        )
      ).map((wordRaw) => WordDomain.fromMdb(wordRaw)),
      query,
    )

    await newWordChunkDomain.deleteSemesterIfEmptyQuery(supportModel)
    return newWordChunkDomain
  }

  /** Delete support from persistence if condition is met. This is an automatic update process and therefore is private */
  private async deleteSemesterIfEmptyQuery(supportModel: SupportModel) {
    // TODO: The condition here is not 100% accurate. But then
    // TODO: Deleting semester is not really important.
    if (this.words.length > 0) return
    if (Object.keys(this.query).length !== 1 || !this.query.semester) return

    const semesterRemovedSupportDomain = (
      await SupportDomain.fromMdb(this.atd, supportModel)
    ).removeSemester(this.query.semester)

    await supportModel
      .findByIdAndUpdate(
        semesterRemovedSupportDomain.id,
        semesterRemovedSupportDomain.toMdbUpdate(),
      )
      .exec()
  }

  toResDTO(): Partial<IWord>[] {
    return this.words.map((word) => word.toResDTO(this.atd))
  }

  toGetWordIdsResDTO(): string[] {
    return this.words.map((word) => word.id)
  }
}
