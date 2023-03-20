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

  async get(): Promise<Partial<IWord>[]> {
    return (
      await this.deprecatedWordModel
        .find()
        .sort({
          createdAt: -1,
        })
        .exec()
    ).map((props) => WordDomain.fromMdb(props).toResDTO())
  }

  async getById(id: string): Promise<Partial<IWord>> {
    return WordDomain.fromMdb(
      await this.deprecatedWordModel.findById(id).exec(),
    ).toResDTO()
  }
}
