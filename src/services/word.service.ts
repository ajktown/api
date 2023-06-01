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
  DeprecatedSupportsDocument,
} from '@/schemas/deprecated-supports.schema'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class WordService {
  constructor(
    @InjectModel(DeprecatedWordSchemaProps.name)
    private deprecatedWordModel: Model<DeprecatedWordDocument>,
    @InjectModel(DeprecatedSupportSchemaProps.name)
    private deprecatedSupportsModel: Model<DeprecatedSupportsDocument>,
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

    let supportDomain: SupportDomain | undefined
    try {
      supportDomain = SupportDomain.fromMdb(
        await this.deprecatedSupportsModel
          .find(this.getSemesterQueryFactory.getFilter(atd))
          .exec(),
        atd,
      )
    } catch {
      // TODO: Post a new support domain for this user.
    }
    if (!supportDomain) throw new Error('Failed to create support domain')

    const wordDoc = await WordDomain.fromPostReqDto(atd, postReqDto)
      .toDocument(this.deprecatedWordModel)
      .save()
    supportDomain.updateWithWordDoc(wordDoc)

    try {
      await this.deprecatedSupportsModel
        .findByIdAndUpdate(supportDomain.id, supportDomain.toMdbUpdate())
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
    return (
      await this.deprecatedWordModel
        .find(
          this.getWordQueryFactory.getFilter(atd, query),
          this.getWordQueryFactory.getProjection(),
          this.getWordQueryFactory.getOptions(query),
        )
        .sort(this.getWordQueryFactory.toSort())
        .exec()
    ).map((wordRaw) => WordDomain.fromMdb(wordRaw).toResDTO(atd))
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
  async getById(id: string, atd: AccessTokenDomain): Promise<Partial<IWord>> {
    return WordDomain.fromMdb(
      await this.deprecatedWordModel.findById(id).exec(),
    ).toResDTO(atd)
  }
}
