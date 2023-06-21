import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { WordDomain } from '@/domains/word/word.domain'
import { SmartPostWordBodyDTO } from '@/dto/smart-post-word-body.dto'
import { RandomSampleToWordPrompt } from '@/prompts/random-sentence-to-word.prompt'
import {
  SupportProps,
  SupportModel,
} from '@/schemas/deprecated-supports.schema'
import {
  DeprecatedWordSchemaProps,
  WordModel,
} from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class SmartWordService {
  constructor(
    @InjectModel(DeprecatedWordSchemaProps.name)
    private deprecatedWordModel: WordModel,
    @InjectModel(SupportProps.name)
    private supportModel: SupportModel,
    private randomSampleToWordPrompt: RandomSampleToWordPrompt,
  ) {}

  async post(
    atd: AccessTokenDomain,
    smartPostWordReq: SmartPostWordBodyDTO,
  ): Promise<WordDomain> {
    const wordDomain = await WordDomain.fromRawDangerously(
      await this.randomSampleToWordPrompt.toIWord(smartPostWordReq.givenStr),
    )

    return wordDomain.post(atd, this.deprecatedWordModel, this.supportModel)
  }
}
