import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { SupportDomain } from '@/domains/support/support.domain'
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

    return WordDomain.fromMdb(wordDoc)
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
