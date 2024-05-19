import { AccessTokenDomain } from '../auth/access-token.domain'
import { ISharedResource } from './index.interface'
import { BadRequestError } from '@/errors/400/index.error'
import {
  SharedResourceDoc,
  SharedResourceModel,
  SharedResourceProps,
} from '@/schemas/shared-resources.schema'
import { PostSharedResourceDTO } from '@/dto/post-shared-resource.dto'
import { WordService } from '@/services/word.service'
import { NotExistOrNoPermissionError } from '@/errors/404/not-exist-or-no-permission.error'
import { GetSharedResourceRes } from '@/responses/get-shared-resource.res'
import { WordModel } from '@/schemas/deprecated-word.schema'
import { WordDomain } from '../word/word.domain'
import { PatchSharedResourceDTO } from '@/dto/patch-shared-resource-dto'

export class SharedResourceDomain {
  readonly props: ISharedResource

  private constructor(
    props: ISharedResource,
    nullableAtd: null | AccessTokenDomain,
  ) {
    this.props = props

    // if the shared resource is owned by the requester
    // Even if it is expired, the owner can still see it
    if (nullableAtd && props.ownerId === nullableAtd.userId) return

    // non-owners from now on:
    if (this.isExpired) throw new NotExistOrNoPermissionError()
  }

  get isExpired() {
    return this.props.expireInSecs < Date.now().valueOf()
  }

  static fromMdb(
    props: SharedResourceDoc,
    nullableAtd: null | AccessTokenDomain,
  ): SharedResourceDomain {
    if (typeof props !== 'object') throw new NotExistOrNoPermissionError()

    return new SharedResourceDomain(
      {
        id: props.id,
        ownerId: props.ownerID,
        expireInSecs: props.expireInSecs,
        wordId: props.wordId,
        updatedAt: props.updatedAt,
        createdAt: props.createdAt,
      },
      nullableAtd,
    )
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

      // Check if the same shared resource exists:
      // If somehow more than one document is created, the latest one is returned.
      const alreadyExistLatestDoc = await model
        .findOne({
          ownerId: atd.userId,
          wordId: dto.wordId,
        })
        .sort({ createdAt: -1 })

      if (alreadyExistLatestDoc) {
        return SharedResourceDomain.fromMdb(alreadyExistLatestDoc, atd)
      }
      const props: SharedResourceProps = {
        ownerID: atd.userId,
        expireInSecs: new Date().valueOf() + dto.expireAfterSecs * 1000,
        wordId: dto.wordId,
      }
      return SharedResourceDomain.fromMdb(await new model(props).save(), atd)
    } catch {
      throw new NotExistOrNoPermissionError()
    }
  }

  /** Get the shared resource with given id */
  static async fromId(
    id: string,
    nullableAtd: null | AccessTokenDomain,
    model: SharedResourceModel,
  ): Promise<SharedResourceDomain> {
    return SharedResourceDomain.fromMdb(await model.findById(id), nullableAtd)
  }

  static async fromWordId(
    wordId: string,
    nullableAtd: null | AccessTokenDomain,
    model: SharedResourceModel,
  ): Promise<SharedResourceDomain> {
    return SharedResourceDomain.fromMdb(
      await model
        .findOne({
          wordId: wordId,
        })
        .sort({ createdAt: -1 }),
      nullableAtd,
    )
  }

  static async fromSignedInUser(
    atd: AccessTokenDomain,
    model: SharedResourceModel,
  ): Promise<SharedResourceDomain[]> {
    const docs = await model
      .find({
        ownerId: atd.userId,
      })
      .sort({ createdAt: -1 })

    return docs.map((doc) => SharedResourceDomain.fromMdb(doc, atd))
  }

  /** Returns props of the SharedResourceDomain */
  async toResDTO(
    wordModel: WordModel,
    model: SharedResourceModel,
  ): Promise<GetSharedResourceRes> {
    let word: WordDomain | null = null
    if (this.props.wordId) {
      try {
        word = WordDomain.fromMdb(
          await wordModel.findById(this.props.wordId).exec(),
        )
      } catch {
        await model.findByIdAndDelete(this.props.id)
        throw new NotExistOrNoPermissionError()
      }
    }

    return {
      sharedResource: this.props,
      word: word?.toSharedResDTO() || null,
    }
  }

  async extend(
    dto: PatchSharedResourceDTO,
    model: SharedResourceModel,
  ): Promise<SharedResourceDomain> {
    this.props.expireInSecs += dto.extendSecs * 1000

    return SharedResourceDomain.fromMdb(
      await model.findByIdAndUpdate(
        this.props.id,
        { expireInSecs: this.props.expireInSecs },
        { new: true },
      ),
      null,
    )
  }
}
