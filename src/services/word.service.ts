import { dummyWordDomains } from '@/domains/word/index.dummy'
import { WordDomain } from '@/domains/word/word.domain'
import { PostWordReqDTO } from '@/dto/post-word.req-dto'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaDefinitions,
} from '@/schemas/deprecated-word.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class WordService {
  constructor(
    @InjectModel(DeprecatedWordSchemaDefinitions.name)
    private deprecatedWordModel: Model<DeprecatedWordDocument>,
  ) {}

  get(): WordDomain[] {
    return dummyWordDomains
  }

  getById(id: string): WordDomain | undefined {
    console.log({ id }) // TODO: Remove it
    return dummyWordDomains[0] // TODO: Fix it, it just returns the first index
  }

  post(postReqDto: PostWordReqDTO): WordDomain | undefined {
    const createdWord = new this.deprecatedWordModel({
      ...postReqDto,
      // TODO: Write exceptions here, i.e) language is the old way of writing so the dto had to specify below.
      language: postReqDto.languageCode,
      ownerID: 'abc',
    })
    return createdWord.save()
    /* ! Returned following data.
    {
      "ownerID": "abc",
      "reviewdOn": [],
      "tag": [],
      "_id": "640e3d82304cb13bf75d9e9f",
      "__v": 0
    }
    */
  }
}
