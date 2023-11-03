import { AccessTokenDomain } from '../auth/access-token.domain'
import { ISharedResource } from './index.interface'
import { BadRequestError } from '@/errors/400/index.error'
import {
  SharedResourceDoc,
  SharedResourceModel,
} from '@/schemas/shared-resources.schema'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { PostSharedResourceDTO } from '@/dto/post-shared-resource.dto'
import { WordService } from '@/services/word.service'
import { NotExistOrNoPermissionError } from '@/errors/400/not-exist-or-no-permission.error'

export class SharedResourceDomain {
  readonly props: ISharedResource

  private constructor(props: ISharedResource) {
    // defaults:
    // N/A

    // finally:
    this.props = props
  }

  static fromMdb(props: SharedResourceDoc): SharedResourceDomain {
    if (typeof props !== 'object') throw new DataNotObjectError()

    return new SharedResourceDomain({
      id: props.id,
      ownerId: props.ownerID,
      expireInSecs: props.expireInSecs,
      wordId: props.wordId,
      updatedAt: props.updatedAt,
      createdAt: props.createdAt,
    })
  }

  /** Create sharedResource just for the word */
  static async postSharedWord(
    atd: AccessTokenDomain,
    dto: PostSharedResourceDTO,
    model: SharedResourceModel,
    wordService: WordService,
  ): Promise<SharedResourceDomain> {
    // checkers:
    if (!dto.wordId)
      throw new BadRequestError('Requires at least one data for wordId')

    try {
      // If the word itself is not found or the user does not have permission to access it, throw the same error.
      const wordDomain = await wordService.getById(dto.wordId)
      wordDomain.toResDTO(atd) // expect resDTO always checks for permission

      return SharedResourceDomain.fromMdb(
        await new model({
          ownerId: atd.userId,
          expireInSecs: dto.expireInSecs,
          wordId: dto.wordId,
        }).save(),
      )
    } catch {
      throw new NotExistOrNoPermissionError()
    }
  }

  // async updateWithPutDto(
  //   atd: AccessTokenDomain,
  //   dto: PutWordByIdBodyDTO,
  //   wordModel: WordModel,
  // ): Promise<WordDomain> {
  //   if (atd.userId !== this.props.userId) {
  //     throw new UpdateForbiddenError(atd, `Word`)
  //   }
  //   return WordDomain.fromMdb(
  //     await wordModel
  //       .findByIdAndUpdate(
  //         this.id,
  //         {
  //           language: dto.languageCode,
  //           isFavorite: dto.isFavorite,
  //           word: dto.term,
  //           pronun: dto.pronunciation,
  //           meaning: dto.definition,
  //           example: dto.example,
  //           exampleLink: dto.exampleLink,
  //           tag: dto.tags,
  //           isArchived: dto.isArchived,
  //         },
  //         { new: true },
  //       )
  //       .exec(),
  //   )
  // }

  // /** Deletes word from persistence, if access is given */
  // async delete(
  //   atd: AccessTokenDomain,
  //   wordModel: WordModel,
  //   supportModel: SupportModel,
  // ): Promise<void> {
  //   if (atd.userId !== this.props.userId) {
  //     throw new DeleteForbiddenError(atd, `Word`)
  //   }

  //   await wordModel.findByIdAndDelete(this.props.id).exec()
  //   const supportDomain = await SupportDomain.fromMdbByAtd(atd, supportModel)
  //   await supportDomain.updateWithDeletedWord(supportModel)
  // }
}
