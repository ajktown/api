import { AccessTokenDomain } from '../auth/access-token.domain'
import { DomainRoot } from '../index.root'
import { ArchiveDoc, ArchiveModel } from '@/schemas/archive.schema'
import { IArchive } from './index.interface'
import { BadRequestError } from '@/errors/400/index.error'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { PostArchiveActionGroupBodyDTO } from '@/dto/post-archived-action-group.dto'
import { NotExistOrNoPermissionError } from '@/errors/404/not-exist-or-no-permission.error'
import { ReadForbiddenError } from '@/errors/403/action_forbidden_errors/read-forbidden.error'
import { ActionGroupModel } from '@/schemas/action-group.schema'

export class ArchiveDomain extends DomainRoot {
  private readonly props: IArchive

  private constructor(props: Partial<IArchive>) {
    super()
    this.props = props as IArchive
  }

  private static fromDoc(doc: ArchiveDoc): ArchiveDomain {
    if (typeof doc !== 'object') throw new DataNotObjectError()

    return new ArchiveDomain({
      ownerId: doc.ownerId,
      actionGroupId: doc.actionGroupId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static async archiveActionGroup(
    atd: AccessTokenDomain,
    id: string, // actionGroupId
    dto: PostArchiveActionGroupBodyDTO,
    model: ActionGroupModel,
    archiveModel: ArchiveModel,
  ): Promise<ArchiveDomain> {
    // check if such action group exists in the database OR it is owned by the user:
    const actionGroup = await model.findById(id)
    if (!actionGroup) throw new NotExistOrNoPermissionError()
    if (actionGroup.ownerId !== atd.userId) throw new NotExistOrNoPermissionError()

    // check if action group is already archived:
    const docs = await archiveModel.find({ ownerId: atd.userId, actionGroupId: id })
    if (0 < docs.length) {
      throw new BadRequestError('Already archived action group')
    }

    // Archive by creating it:
    const doc = await archiveModel.create({
      ownerId: atd.userId,
      actionGroupId: id,
      message: dto.message,
    })
    return ArchiveDomain.fromDoc(doc)
  }

  toResDTO(atd: AccessTokenDomain): IArchive {
    if (atd.userId !== this.props.ownerId) {
      throw new ReadForbiddenError(atd, `Archive`)
    }

    return this.props
  }
}
