import { PostWordReqDTO } from '@/dto/post-word.req-dto'
import { GlobalLanguageCode } from '@/global.interface'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaProps,
} from '@/schemas/deprecated-word.schema'
import { Model } from 'mongoose'
import { IWord } from './index.interface'

// TODO: Write this domain in a standard format
// Doc: https://dev.to/bendix/applying-domain-driven-design-principles-to-a-nest-js-project-5f7b
// I think every from to file can be like umm... moved together
// ! Dependency-free domain

export class WordDomain {
  private readonly props: Partial<IWord>

  private constructor(props: Partial<IWord>) {
    this.props = props
  }

  static fromDummyDto(dto: PostWordReqDTO & { id: string }): WordDomain {
    return new WordDomain({
      id: dto.id,
      languageCode: dto.languageCode,
      semester: dto.semester,
      isFavorite: dto.isFavorite,
      term: dto.term,
      pronunciation: dto.pronunciation,
      definition: dto.definition,
      example: dto.example,
      tags: dto.tags,
    })
  }

  static fromPostReqDto(dto: PostWordReqDTO): WordDomain {
    return new WordDomain({
      languageCode: dto.languageCode,
      semester: dto.semester,
      isFavorite: dto.isFavorite,
      term: dto.term,
      pronunciation: dto.pronunciation,
      definition: dto.definition,
      example: dto.example,
      tags: dto.tags,
    })
  }

  static fromMdb(props: DeprecatedWordDocument): WordDomain {
    if (typeof props !== 'object') throw new Error('Not Object!')

    return new WordDomain({
      id: props.id,
      languageCode: props.language as GlobalLanguageCode, // TODO: Write a type validator
      semester: props.sem,
      isFavorite: props.isFavorite,
      term: props.word,
      pronunciation: props.pronun,
      definition: props.meaning,
      example: props.example,
      tags: props.tag,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }

  toDocument(deprecatedWordModel: Model<DeprecatedWordDocument>) {
    const docProps: DeprecatedWordSchemaProps = {
      language: this.props.languageCode,
      sem: this.props.semester,
      isFavorite: this.props.isFavorite,
      word: this.props.term,
      pronun: this.props.pronunciation,
      meaning: this.props.definition,
      example: this.props.example,
      tag: this.props.tags,
      ownerID: 'abc',
      // Not used below (Deprecated Props):
      reviewdOn: [],
      order: 1,
      step: 1,
      isPublic: true,
      dateAdded: new Date().valueOf(),
    }
    return new deprecatedWordModel(docProps)
  }

  toResDTO(): Partial<IWord> {
    return this.props
  }
}
