import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { IWord } from '@/domains/word/index.interface'
import { WordDomain } from '@/domains/word/word.domain'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
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
    private termToExamplePrompt: TermToExamplePrompt,
    private getWordQueryFactory: GetWordQueryFactory,
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

    return WordDomain.fromMdb(
      await WordDomain.fromPostReqDto(atd, postReqDto)
        .toDocument(this.deprecatedWordModel)
        .save(),
    ).toResDTO(atd)
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
