import { IAction, IActionDerived, IActionLevel } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { DomainRoot } from '../index.root'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { DataNotPresentError } from '@/errors/400/data-not-present.error'
import { ActionDoc, ActionModel, ActionProps } from '@/schemas/action.schema'
import { PostActionDTO } from '@/dto/post-action.dto'
import { WordDomain } from '../word/word.domain'
import { ActionGroupModel } from '@/schemas/action-group.schema'
import { BadRequestError } from '@/errors/400/index.error'
import { ParentNotExistOrNoPermissionError } from '@/errors/400/parent-not-exist-or-no-permission.error'

export class ActionDomain extends DomainRoot {
  private readonly props: IAction

  private constructor(props: IAction) {
    super()
    if (!props.ownerID) throw new DataNotPresentError('ownerID')
    this.props = props
  }

  // the action level only exists as defined in IActionLevel
  static getActionLevel(level: number): IActionLevel {
    return Math.max(0, Math.min(3, level)) as IActionLevel
  }

  /**
   * Returns empty action domain for the given date
   */
  static fromEmpty(
    atd: AccessTokenDomain,
    groupId: string,
    date: Date,
  ): ActionDomain {
    return new ActionDomain({
      id: '',
      ownerID: atd.userId,
      groupId: groupId,
      message: '',
      createdAt: date,
      updatedAt: date,
    })
  }

  static fromWordDomain(
    atd: AccessTokenDomain,
    groupId: string,
    wordDomain: WordDomain,
  ): ActionDomain {
    const props = wordDomain.toResDTO(atd)

    return new ActionDomain({
      id: '',
      ownerID: atd.userId,
      groupId: groupId,
      message: '',
      createdAt: new Date(props.dateAdded),
      // the action cannot be updated, but since it is from word domain,
      // we can simply set the dateAdded as updatedAt.
      updatedAt: new Date(props.dateAdded),
    })
  }

  static fromMdb(props: ActionDoc): ActionDomain {
    if (typeof props !== 'object') throw new DataNotObjectError()

    return new ActionDomain({
      id: props.id,
      ownerID: props.ownerID,
      groupId: props.groupId,
      message: props.message,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }

  static async post(
    atd: AccessTokenDomain,
    dto: PostActionDTO,
    model: ActionModel,
    actionGroupModel: ActionGroupModel,
  ): Promise<ActionDomain> {
    // TODO: Post has to check the followings
    // TODO: 1. the group id exists
    const doc = await actionGroupModel.findById(dto.groupId)
    // const actionGroupDomain = ActionGroupDomain.fromMdb(atd, doc)

    // Do not allow end users (or potential hackers) to know if the group exists or not.
    if (!doc)
      throw new ParentNotExistOrNoPermissionError('ActionGroup', dto.groupId)
    if (doc.ownerId !== atd.userId)
      throw new BadRequestError(
        'You do not have permission to post action to this group',
      )

    // must also check if reserved named is used

    // TODO: Check if action exists for today (This will be implemented in later future)
    // TODO: 4. The group validates that this action can be added (group is like a parent, and this is child. so it requires parent's validation)
    // TODO: 5. And more...

    // Create it if passed:
    const docProps: ActionProps = {
      ownerID: atd.userId,
      groupId: dto.groupId,
      message: dto.message || '',
    }
    return ActionDomain.fromMdb(await new model(docProps).save())
  }

  toResDTO(level: number): IActionDerived {
    return {
      ...this.props,
      level: level,
    }
  }
}
