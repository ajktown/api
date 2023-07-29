import { PostWordBodyDTO } from '@/dto/post-word-body.dto'
import { GlobalLanguageCode } from '@/global.interface'
import { WordDoc, WordProps, WordModel } from '@/schemas/deprecated-word.schema'
import { IWord } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { semesterLambda } from '@/lambdas/semester.lambda'
import { SupportModel } from '@/schemas/deprecated-supports.schema'
import { SupportDomain } from '../support/support.domain'
import { PutWordByIdBodyDTO } from '@/dto/put-word-body.dto'
import { DomainRoot } from '../index.root'
import { DeleteForbiddenError } from '@/errors/403/action_forbidden_errors/delete-forbidden.error'
import { UpdateForbiddenError } from '@/errors/403/action_forbidden_errors/update-forbidden.error'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { BadRequestError } from '@/errors/400/index.error'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { DataNotPresentError } from '@/errors/400/data-not-present.error'

// TODO: Write this domain in a standard format
// Doc: https://dev.to/bendix/applying-domain-driven-design-principles-to-a-nest-js-project-5f7b
// TODO: every static function and toDocument() or toDTO() could be moved to other files instead. But not decided yet.
// ! Dependency-free domain

export class WordDomain extends DomainRoot {
  private readonly props: Partial<IWord>

  private constructor(props: Partial<IWord>) {
    super()
    if (!props.userId) throw new DataNotPresentError('User ID')

    this.props = props
    props.tags = this.intoTrimmedAndUniqueArray(props.tags) // every tag must be trimmed/unique all the time

    // old wordy used to not have createdAt. So, if createdAt not present, it will set it based on dateAdded.
    if (!this.props.createdAt) this.props.createdAt = new Date(props.dateAdded)
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
      dateAdded: new Date().valueOf(),
    })
  }

  static fromMdb(props: WordDoc): WordDomain {
    if (typeof props !== 'object') throw new DataNotObjectError()

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
      createdAt: props.createdAt
        ? new Date(props.createdAt)
        : new Date(props.dateAdded),
      updatedAt: props.updatedAt
        ? new Date(props.updatedAt)
        : new Date(props.dateAdded),
    })
  }

  async post(
    atd: AccessTokenDomain,
    model: WordModel,
    supportModel: SupportModel,
  ): Promise<WordDomain> {
    const newlyPostedWordDomain = WordDomain.fromMdb(
      await this.toModel(model).save(),
    )

    try {
      const supportDomain = await SupportDomain.fromMdb(atd, supportModel)
      await supportDomain
        .updateWithPostedWord(atd, newlyPostedWordDomain)
        .update(supportModel)
    } catch {
      // Something went wrong, and therefore should delete the word from persistence
      await newlyPostedWordDomain.delete(atd, model, supportModel)
      throw new BadRequestError('Something went wrong while posting word')
    }

    return newlyPostedWordDomain
  }

  private toModel(wordModel: WordModel): WordDoc {
    const docProps: WordProps = {
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
      throw new ReadForbiddenError(atd, `Word`)
    }

    return this.props
  }

  async updateWithPutDto(
    atd: AccessTokenDomain,
    dto: PutWordByIdBodyDTO,
    wordModel: WordModel,
  ): Promise<WordDomain> {
    if (atd.userId !== this.props.userId) {
      throw new UpdateForbiddenError(atd, `Word`)
    }
    return WordDomain.fromMdb(
      await wordModel
        .findByIdAndUpdate(
          this.id,
          {
            language: dto.languageCode,
            isFavorite: dto.isFavorite,
            word: dto.term,
            pronun: dto.pronunciation,
            meaning: dto.definition,
            example: dto.example,
            tag: dto.tags,
          },
          { new: true },
        )
        .exec(),
    )
  }

  /** Deletes word from persistence, if access is given */
  async delete(
    atd: AccessTokenDomain,
    wordModel: WordModel,
    supportModel: SupportModel,
  ): Promise<void> {
    if (atd.userId !== this.props.userId) {
      throw new DeleteForbiddenError(atd, `Word`)
    }

    await wordModel.findByIdAndDelete(this.props.id).exec()
    const supportDomain = await SupportDomain.fromMdb(atd, supportModel)
    await supportDomain.updateWithWordDeleted(supportModel)
  }
}
