import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { WordChunkDomain } from '@/domains/word/word-chunk.domain'
import { WordDomain } from '@/domains/word/word.domain'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { PatchWordByIdBodyDTO } from '@/dto/put-word-body.dto'
import { BadRequestError } from '@/errors/400/index.error'
import { NotExistOrNoPermissionError } from '@/errors/404/not-exist-or-no-permission.error'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { getDetectedLanguageLambda } from '@/lambdas/get-detected-language.lambda'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import {
  SupportProps,
  SupportModel,
} from '@/schemas/deprecated-supports.schema'
import { WordProps, WordModel } from '@/schemas/deprecated-word.schema'
import { PreferenceModel, PreferenceProps } from '@/schemas/preference.schema'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class WordService {
  constructor(
    @InjectModel(WordProps.name)
    private wordModel: WordModel,
    @InjectModel(SupportProps.name)
    private supportModel: SupportModel,
    @InjectModel(PreferenceProps.name)
    private preferenceModel: PreferenceModel,
    private termToExamplePrompt: TermToExamplePrompt,
    private getWordQueryFactory: GetWordQueryFactory,
    private readonly logger: Logger,
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

    if (!postReqDto.languageCode) {
      postReqDto.languageCode = await getDetectedLanguageLambda(
        postReqDto.term,
        this.logger,
      )
    }

    return await WordDomain.fromPostDto(atd, postReqDto).post(
      atd,
      this.wordModel,
      this.supportModel,
      this.preferenceModel,
    )
  }

  /** Get words with given query */
  async get(
    nullableAtd: null | AccessTokenDomain,
    query: GetWordQueryDTO,
  ): Promise<WordChunkDomain> {
    if (!nullableAtd) {
      throw new NotExistOrNoPermissionError()
    }

    return WordChunkDomain.fromMdb(
      nullableAtd,
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

  async patchWordById(
    id: string,
    atd: AccessTokenDomain,
    dto: PatchWordByIdBodyDTO,
  ): Promise<WordDomain> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestError('Require at least one or more field to update!')
    }
    const wordDomain = await this.getById(id)
    return wordDomain.updateWithPutDto(
      atd,
      dto,
      this.wordModel,
      this.preferenceModel,
    )
  }

  async deleteById(id: string, atd: AccessTokenDomain): Promise<void> {
    const deletingWordDomain = await this.getById(id)
    await deletingWordDomain.delete(atd, this.wordModel, this.supportModel)
  }
}
