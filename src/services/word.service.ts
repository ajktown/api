import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { WordChunkDomain } from '@/domains/word/word-chunk.domain'
import { WordDomain } from '@/domains/word/word.domain'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
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
  ) {}

  /** Post a new word */
  async post(
    atd: AccessTokenDomain,
    postReqDto: PostWordBodyDTO,
  ): Promise<WordDomain> {
    if (!postReqDto.example) {
      // If no example given, Ask Chat GPT to generate one, if allowed.
      postReqDto.example = await this.termToExamplePrompt.get(postReqDto.term)
    }

    return await WordDomain.post(
      atd,
      postReqDto,
      this.wordModel,
      this.supportModel,
    )
  }

  /** Get words with given query */
  async get(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
  ): Promise<WordChunkDomain> {
    return WordChunkDomain.get(
      atd,
      query,
      this.wordModel,
      this.supportModel,
      this.getWordQueryFactory,
    )
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
