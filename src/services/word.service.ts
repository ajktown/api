import { IWord } from '@/domains/word/index.interface'
import { WordDomain } from '@/domains/word/word.domain'
import { GetWordQueryDTO } from '@/dto/get-word-query.dto'
import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GetWordQueryFactory } from '@/factories/get-word-query.factory'
import { GlobalLanguageCode } from '@/global.interface'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { GetWordIdsRes } from '@/responses/get-word-ids.res'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { timeHandler } from '@/handlers/time.handler'

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
  async get(query: GetWordQueryDTO): Promise<Partial<IWord>[]> {
    return (
      await this.deprecatedWordModel
        .find(this.getWordQueryFactory.toFind(query))
        .sort(this.getWordQueryFactory.toSort())
        .limit(query.limit)
        .exec()
    ).map((props) => WordDomain.fromMdb(props).toResDTO())
  }

  /** Get word ids by given query */
  async getWordIds(query: GetWordQueryDTO): Promise<GetWordIdsRes> {
    const wordIdsSet = new Set<string>()
    const daysAgoSet = new Set<number>()
    const languagesSet = new Set<GlobalLanguageCode>()
    const tagsSet = new Set<string>()

    const words = await this.get(query)

    words.forEach((word) => {
      word.id && wordIdsSet.add(word.id)
      word.createdAt && daysAgoSet.add(timeHandler.getDaysAgo(word.createdAt))
      word.languageCode && languagesSet.add(word.languageCode)
      word.tags.forEach((tag) => tagsSet.add(tag))
    })

    return {
      wordIds: Array.from(wordIdsSet),
      daysAgo: Array.from(daysAgoSet),
      languages: Array.from(languagesSet),
      tags: Array.from(tagsSet),
    }
  }

  /** Get word data by given id */
  async getById(id: string): Promise<Partial<IWord>> {
    return WordDomain.fromMdb(
      await this.deprecatedWordModel.findById(id).exec(),
    ).toResDTO()
  }
}
