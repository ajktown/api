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

  async get(query: GetWordQueryDTO): Promise<Partial<IWord>[]> {
    return (
      await this.deprecatedWordModel
        .find(this.getWordQueryFactory.toFind(query))
        .sort(this.getWordQueryFactory.toSort())
        .limit(query.limit)
        .exec()
    ).map((props) => WordDomain.fromMdb(props).toResDTO())
  }

  async getById(id: string): Promise<Partial<IWord>> {
    return WordDomain.fromMdb(
      await this.deprecatedWordModel.findById(id).exec(),
    ).toResDTO()
  }
}
