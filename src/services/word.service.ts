import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { SupportDomain } from '@/domains/support/support.domain'
import { IWord } from '@/domains/word/index.interface'
import { WordDomain } from '@/domains/word/word.domain'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetSemesterQueryFactory } from '@/factories/get-semester-query.factory'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import {
  DeprecatedSupportSchemaProps,
  SupportModel,
} from '@/schemas/deprecated-supports.schema'
import {
  DeprecatedWordSchemaProps,
  WordModel,
} from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class WordService {
  constructor(
    @InjectModel(DeprecatedWordSchemaProps.name)
    private wordModel: WordModel,
    @InjectModel(DeprecatedSupportSchemaProps.name)
    private supportModel: SupportModel,
    private termToExamplePrompt: TermToExamplePrompt,
    private getWordQueryFactory: GetWordQueryFactory,
    private getSemesterQueryFactory: GetSemesterQueryFactory,
  ) {}

  /** Post a new word */
  async post(
    atd: AccessTokenDomain,
    postReqDto: PostWordBodyDTO,
  ): Promise<Partial<IWord>> {
    if (!postReqDto.example) {
      // If no example given, Ask Chat GPT to generate one, if allowed.
      postReqDto.example = await this.termToExamplePrompt.get(postReqDto.term)
    }

    const wordDoc = await WordDomain.fromPostReqDto(atd, postReqDto)
      .toDocument(this.wordModel)
      .save()

    const supportDomain = await SupportDomain.fromMdb(atd, this.supportModel)
    supportDomain.updateWithWordDoc(wordDoc)

    try {
      await this.supportModel
        .findByIdAndUpdate(supportDomain.id, supportDomain.toMdbUpdate(), {
          upsert: true,
        })
        .exec()
    } catch {
      // TODO: If somehow fails to add, we need to delete the word.
      // TODO: And raise an error.
    }

    return WordDomain.fromMdb(wordDoc).toResDTO(atd)
  }

  /** Get words with given query */
  async get(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
  ): Promise<Partial<IWord>[]> {
    const response = (
      await this.wordModel
        .find(
          this.getWordQueryFactory.getFilter(atd, query),
          this.getWordQueryFactory.getProjection(),
          this.getWordQueryFactory.getOptions(query),
        )
        .sort(this.getWordQueryFactory.toSort())
        .exec()
    ).map((wordRaw) => WordDomain.fromMdb(wordRaw).toResDTO(atd))

    if (
      // TODO: The condition here is not 100% accurate. But then
      // TODO: Deleting semester is not really important.
      response.length === 0 &&
      Object.keys(query).length === 1 &&
      query.semester
    ) {
      const semesterRemovedSupportDomain = (
        await SupportDomain.fromMdb(atd, this.supportModel)
      ).removeSemester(query.semester)

      await this.supportModel
        .findByIdAndUpdate(
          semesterRemovedSupportDomain.id,
          semesterRemovedSupportDomain.toMdbUpdate(),
        )
        .exec()
    }

    return response
  }

  /** Get word ids with given query */
  async getWordIds(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
  ): Promise<string[]> {
    const words = await this.get(atd, query)
    return words.map((e) => e.id)
  }

  /** Get word data with given id */
  async getById(id: string): Promise<WordDomain> {
    return WordDomain.fromMdb(await this.wordModel.findById(id).exec())
  }

  async deleteById(id: string, atd: AccessTokenDomain): Promise<void> {
    const deletingWordDomain = await this.getById(id)
    await deletingWordDomain.delete(atd, this.wordModel, this.supportModel)
  }
}
