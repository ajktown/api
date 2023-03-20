import { WordDomain } from '@/domains/word/word.domain'
import { SmartPostWordReqDTO } from '@/dto/smart-post-word.req-dto'
import { RandomSampleToWordPrompt } from '@/prompts/random-sentence-to-word.prompt'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class SmartWordService {
  constructor(
    @InjectModel(DeprecatedWordSchemaProps.name)
    private deprecatedWordModel: Model<DeprecatedWordDocument>,
    private randomSampleToWordPrompt: RandomSampleToWordPrompt,
  ) {}

  async post(smartPostWordReq: SmartPostWordReqDTO): Promise<WordDomain> {
    return WordDomain.fromMdb(
      await WordDomain.fromRaw(
        await this.randomSampleToWordPrompt.toIWord(smartPostWordReq.givenStr),
      )
        .toDocument(this.deprecatedWordModel)
        .save(),
    )
  }
}
