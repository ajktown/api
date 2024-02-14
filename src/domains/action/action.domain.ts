import { IAction, IActionLevel } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { DomainRoot } from '../index.root'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { DataNotPresentError } from '@/errors/400/data-not-present.error'
import { ActionDoc, ActionModel, ActionProps } from '@/schemas/action.schema'
import { PostActionDTO } from '@/dto/post-action.dto'
import { WordDomain } from '../word/word.domain'

export class ActionDomain extends DomainRoot {
  private readonly props: Partial<IAction>

  private constructor(props: Partial<IAction>) {
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
      ownerID: atd.userId,
      groupId: groupId,
      level: 0,
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
      ownerID: atd.userId,
      groupId: groupId,
      level: 4,
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
      level: this.getActionLevel(props.level),
      message: props.message,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }

  static async post(
    atd: AccessTokenDomain,
    dto: PostActionDTO,
    model: ActionModel,
  ): Promise<ActionDomain> {
    // TODO: Post has to check the followings
    // TODO: 1. the group id exists
    // TODO: 1. Group ID will decide the level based on the given time and given value.
    // TODO: 2. the group is owned by the atd
    // TODO: 3. the date has not passed
    // TODO: 4. The group validates that this action can be added (group is like a parent, and this is child. so it requires parent's validation)
    // TODO: 5. And more...

    const fixedLevelForTestNow = 1 // TODO: Make sure that the group decides it.

    // Create it if passed:
    const docProps: ActionProps = {
      ownerID: atd.userId,
      groupId: dto.groupId,
      level: fixedLevelForTestNow,
      message: dto.message || '',
    }
    return ActionDomain.fromMdb(await new model(docProps).save())
  }

  toResDTO(): Partial<IAction> {
    return this.props
  }
}
