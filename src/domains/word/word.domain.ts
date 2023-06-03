import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GlobalLanguageCode } from '@/global.interface'
import {
  DeprecatedWordDocument,
  DeprecatedWordSchemaProps,
  WordModel,
} from '@/schemas/deprecated-word.schema'
import { Model } from 'mongoose'
import { IWord } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { semesterLambda } from '@/lambdas/semester.lambda'
import { SupportModel } from '@/schemas/deprecated-supports.schema'
import { SupportDomain } from '../support/support.domain'

// TODO: Write this domain in a standard format
// Doc: https://dev.to/bendix/applying-domain-driven-design-principles-to-a-nest-js-project-5f7b
// TODO: every static function and toDocument() or toDTO() could be moved to other files instead. But not decided yet.
// ! Dependency-free domain

export class WordDomain {
  private readonly props: Partial<IWord>

  private constructor(props: Partial<IWord>) {
    if (!props.userId) throw new Error('No userId (OwnerID)!')
    this.props = props

    // addedDate is used to sort data.
    const date = props.dateAdded ? new Date(props.dateAdded) : new Date()
    this.props.dateAdded = date.valueOf()
  }

  get id() {
    return this.props.id
  }

  static fromRawDangerously(props: Partial<IWord>): WordDomain {
    return new WordDomain(props)
  }

  static fromPostDto(atd: AccessTokenDomain, dto: PostWordBodyDTO): WordDomain {
    return new WordDomain({
      userId: atd.userId,
      languageCode: dto.languageCode,
      semester: semesterLambda.now(),
      isFavorite: dto.isFavorite,
      term: dto.term,
      pronunciation: dto.pronunciation,
      definition: dto.definition,
      example: dto.example,
      tags: dto.tags,
      dateAdded: dto.dateAdded,
    })
  }

  static fromMdb(props: DeprecatedWordDocument): WordDomain {
    if (typeof props !== 'object') throw new Error('Not Object!')

    return new WordDomain({
      id: props.id,
      userId: props.ownerID,
      languageCode: props.language as GlobalLanguageCode, // TODO: Write a type validator
      semester: props.sem,
      isFavorite: props.isFavorite,
      term: props.word,
      pronunciation: props.pronun,
      definition: props.meaning,
      example: props.example,
      tags: props.tag,
      dateAdded: props.dateAdded,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.createdAt),
    })
  }

  async post(
    atd: AccessTokenDomain,
    model: WordModel,
    supportModel: SupportModel,
  ): Promise<WordDomain> {
    console.log(this.toModel(model))
    const wordDoc = await this.toModel(model).save()
    console.log(wordDoc)
    const wordDomain = WordDomain.fromMdb(wordDoc)

    console.log(wordDomain)

    const supportDom = await SupportDomain.fromMdb(atd, supportModel)
    supportDom.updateWithWordDoc(wordDoc)
    try {
      await supportDom.update(supportModel)
    } catch {
      // TODO: If somehow fails to add, we need to delete the word.
      // TODO: And raise an error.
    }
    return wordDomain
  }

  private toModel(wordModel: WordModel): DeprecatedWordDocument {
    const docProps: DeprecatedWordSchemaProps = {
      language: this.props.languageCode,
      sem: this.props.semester,
      isFavorite: this.props.isFavorite,
      word: this.props.term,
      pronun: this.props.pronunciation,
      meaning: this.props.definition,
      example: this.props.example,
      tag: this.props.tags,
      ownerID: this.props.userId,
      dateAdded: this.props.dateAdded,
      // Deprecated Props Below (Not used below from Wordnote, or Wordy v2):
      // reviewdOn: [],
      // order: 1,
      // step: 1,
      // isPublic: true,
    }
    return new wordModel(docProps)
  }

  /** Returns props of the WordDomain, and userId (ownerId) must match
   * to the accessTokenDomain claiming userId
   */
  toResDTO(atd: AccessTokenDomain): Partial<IWord> {
    if (atd.userId !== this.props.userId) {
      throw new Error('No access')
    }

    return this.props
  }

  /** Deletes word from persistence, if access is given */
  async delete(
    atd: AccessTokenDomain,
    wordModel: Model<DeprecatedWordDocument>,
    supportModel: SupportModel,
  ): Promise<void> {
    if (atd.userId !== this.props.userId) {
      throw new Error('No access to delete')
    }

    await wordModel.findByIdAndDelete(this.props.id)
    const supportDomain = await SupportDomain.fromMdb(atd, supportModel)
    await supportDomain.updateWithWordDeleted(supportModel)
  }
}
