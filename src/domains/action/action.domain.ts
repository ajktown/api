import { IAction } from './index.interface'
import { AccessTokenDomain } from '../auth/access-token.domain'
import { DomainRoot } from '../index.root'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { DataNotPresentError } from '@/errors/400/data-not-present.error'
import { ActionDoc, ActionModel, ActionProps } from '@/schemas/action.schema'
import { PostActionDTO } from '@/dto/post-action.dto'

export class ActionDomain extends DomainRoot {
  private readonly props: Partial<IAction>

  private constructor(props: Partial<IAction>) {
    super()
    if (!props.ownerID) throw new DataNotPresentError('ownerID')
    this.props = props
  }

  static fromMdb(props: ActionDoc): ActionDomain {
    if (typeof props !== 'object') throw new DataNotObjectError()

    return new ActionDomain({
      id: props.id,
      ownerID: props.ownerID,
      groupId: props.groupId,
      level: props.level,
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
    }
    return ActionDomain.fromMdb(await new model(docProps).save())
  }

  toResDTO(): Partial<IAction> {
    return this.props
  }
}
