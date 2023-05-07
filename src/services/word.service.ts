import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { IWord } from '@/domains/word/index.interface'
import { WordDomain } from '@/domains/word/word.domain'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { GetWordIdsRes } from '@/responses/get-word-ids.res'
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
  async post(postReqDto: PostWordBodyDTO): Promise<WordDomain> {
    if (!postReqDto.example) {
      // If no example given, Ask Chat GPT to generate one, if allowed.
      postReqDto.example = await this.termToExamplePrompt.get(postReqDto.term)
    }

    return WordDomain.fromMdb(
      await WordDomain.fromPostReqDto(postReqDto)
        .toDocument(this.deprecatedWordModel)
        .save(),
    )
  }

  /** Get words by given query */
  async get(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
  ): Promise<Partial<IWord>[]> {
    return (
      await this.deprecatedWordModel
        .find(
          this.getWordQueryFactory.getFilter(query, atd),
          this.getWordQueryFactory.getProjection(),
          this.getWordQueryFactory.getOptions(query),
        )
        .sort(this.getWordQueryFactory.toSort())
        .limit(query.limit)
        .exec()
    ).map((wordRaw) => WordDomain.fromMdb(wordRaw).toResDTO())
  }

  /** Get word ids by given query */
  async getWordIds(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
  ): Promise<GetWordIdsRes> {
    const words = await this.get(atd, query)
    return {
      length: words.length,
      wordIds: words.map((e) => e.id),
    }
  }

  /** Get word data by given id */
  async getById(id: string): Promise<Partial<IWord>> {
    // TODO: Must apply access control, in a clean way? (Maybe I should do the getWords, instead of
    // TODO: Having a different command
    return WordDomain.fromMdb(
      await this.deprecatedWordModel.findById(id).exec(),
    ).toResDTO()
  }
}
