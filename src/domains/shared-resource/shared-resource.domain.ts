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
import { GetSharedResourcesQueryDTO } from '@/dto/get-shared-resources-query.dto'

export class SharedResourceDomain {
  readonly props: ISharedResource

  private constructor(props: ISharedResource) {
    // defaults:
    // N/A

    // finally:
    this.props = props
  }

  get isExpired() {
    return Date.now() < this.props.expireInSecs
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

      // Check if the same shared resource exists:
      // If somehow more than one document is created, the latest one is returned.
      const alreadyExistLatestDoc = await model
        .findOne({
          ownerId: atd.userId,
          wordId: dto.wordId,
        })
        .sort({ createdAt: -1 })

      if (alreadyExistLatestDoc) {
        return SharedResourceDomain.fromMdb(alreadyExistLatestDoc)
      }

      return SharedResourceDomain.fromMdb(
        await new model({
          ownerId: atd.userId,
          expireInSecs: new Date().valueOf()+ dto.expireAfterSecs,
          wordId: dto.wordId,
        }).save(),
      )
    } catch {
      throw new NotExistOrNoPermissionError()
    }
  }

  /** Get the shared resource with given id */

  static async fromGetSharedResource(
    id: string,
    dto: GetSharedResourcesQueryDTO,
    model: SharedResourceModel,
  ): Promise<SharedResourceDomain> {
    const doc = await model.findById(id)
    if (!doc) throw new NotExistOrNoPermissionError()

    const domain = SharedResourceDomain.fromMdb(doc)
    if (dto.isExpired && domain.isExpired)
      throw new NotExistOrNoPermissionError()

    return domain
  }

  /** Returns props of the SharedResourceDomain */
  toResDTO(): Partial<ISharedResource> {
    return this.props
  }
}
