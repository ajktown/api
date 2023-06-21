import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { WordChunkDomain } from '@/domains/word/word-chunk.domain'
import { WordDomain } from '@/domains/word/word.domain'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { PutWordByIdBodyDTO } from '@/dto/put-word-bofy.dto'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import {
  SupportProps,
  SupportModel,
} from '@/schemas/deprecated-supports.schema'
import { WordProps, WordModel } from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class WordService {
  constructor(
    @InjectModel(WordProps.name)
    private wordModel: WordModel,
    @InjectModel(SupportProps.name)
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

    return await WordDomain.fromPostDto(atd, postReqDto).post(
      atd,
      this.wordModel,
      this.supportModel,
    )
  }

  /** Get words with given query */
  async get(
    atd: AccessTokenDomain,
    query: GetWordQueryDTO,
  ): Promise<WordChunkDomain> {
    return WordChunkDomain.fromMdb(
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

  async putWordById(
    id: string,
    atd: AccessTokenDomain,
    dto: PutWordByIdBodyDTO,
  ): Promise<WordDomain> {
    if (Object.keys(dto).length === 0) {
      throw new Error('Require at least one or more field to update!')
    }
    const wordDomain = await this.getById(id)
    return wordDomain.updateWithPutDto(atd, dto, this.wordModel)
  }

  async deleteById(id: string, atd: AccessTokenDomain): Promise<void> {
    const deletingWordDomain = await this.getById(id)
    await deletingWordDomain.delete(atd, this.wordModel, this.supportModel)
  }
}
