import { dummyWordDomains } from '@/domains/word/index.dummy'
import { IWord } from '@/domains/word/index.interface'
import { WordDomain } from '@/domains/word/word.domain'
import { PostWordReqDTO } from '@/dto/post-word.req-dto'
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
  ) {}

  async post(postReqDto: PostWordReqDTO): Promise<WordDomain> {
    return WordDomain.fromMdb(
      await WordDomain.fromPostReqDto(postReqDto)
        .toDocument(this.deprecatedWordModel)
        .save(),
    )
  }

  get(): Partial<IWord>[] {
    return dummyWordDomains.map((each) => each.toResDTO())
  }

  getById(id: string): WordDomain | undefined {
    console.log({ id }) // TODO: Remove it
    return dummyWordDomains[0] // TODO: Fix it, it just returns the first index
  }
}
