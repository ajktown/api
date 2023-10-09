import { AccessTokenDomain } from '../auth/access-token.domain'
import { ISharedResource } from './index.interface'
import { BadRequestError } from '@/errors/400/index.error'
import {
  SharedResourceDoc,
  SharedResourceModel,
} from '@/schemas/shared-resources.schema'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { PostSharedResourceDTO } from '@/dto/post-shared-resource.dto'

export class SharedResourceDomain {
  readonly props: ISharedResource

  private constructor(props: ISharedResource) {
    // checkers:
    if (!props.wordId)
      throw new BadRequestError('Requires at least one data for wordId')
    // The checker below will be used, and is left for reference for future coding.
    // if (!props.wordId || !props.supportId)
    // throw new BadRequestError('Requires at least one data either for wordId or supportId')

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

  async post(
    atd: AccessTokenDomain,
    dto: PostSharedResourceDTO,
    model: SharedResourceModel,
  ): Promise<SharedResourceDomain> {
    return SharedResourceDomain.fromMdb(
      await new model({
        ownerId: atd.userId,
        expireInSecs: dto.expireInSecs,
        wordId: dto.wordId,
      }).save(),
    )
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
