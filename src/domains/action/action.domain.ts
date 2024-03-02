import {
  IAction,
  IActionDerived,
  IActionInput,
  IActionLevel,
} from './index.interface'
import { DomainRoot } from '../index.root'
import { DataNotObjectError } from '@/errors/400/data-not-object.error'
import { ActionDoc } from '@/schemas/action.schema'
import { WordDomain } from '../word/word.domain'
import { timeHandler } from '@/handlers/time.handler'

/**
 * WARNING: Since ActionDomain is managed by ActionGroup to maintain its integrity,
 * it cannot be created or updated without permission from ActionGroup,
 * and therefore cannot be created or updated in this domain.
 */
export class ActionDomain extends DomainRoot {
  private readonly props: IAction

  private constructor(timezone: string, input: IActionInput) {
    super()
    this.props = {
      ...input,
      yyyymmdd: timeHandler.getYYYYMMDD(input.createdAt, timezone),
    }
  }

  get yyyymmdd(): string {
    return this.props.yyyymmdd
  }

  // the action level only exists as defined in IActionLevel
  static getActionLevel(level: number): IActionLevel {
    return Math.max(0, Math.min(3, level)) as IActionLevel
  }

  /**
   * Returns empty action domain for the given date
   */
  static fromEmpty(
    groupId: string,
    timezone: string,
    date: Date,
  ): ActionDomain {
    return new ActionDomain(timezone, {
      id: '',
      ownerId: '',
      groupId: groupId,
      createdAt: date,
      updatedAt: date,
    })
  }

  static fromWordDomain(
    groupId: string,
    timezone: string,
    wordDomain: WordDomain,
  ): ActionDomain {
    const props = wordDomain.toSharedResDTO()

    return new ActionDomain(timezone, {
      id: '',
      ownerId: '',
      groupId: groupId,
      createdAt: new Date(props.dateAdded),
      // the action cannot be updated, but since it is from word domain,
      // we can simply set the dateAdded as updatedAt.
      updatedAt: new Date(props.dateAdded),
    })
  }

  static fromMdb(timezone: string, doc: ActionDoc): ActionDomain {
    if (typeof doc !== 'object') throw new DataNotObjectError()

    return new ActionDomain(timezone, {
      id: doc.id,
      ownerId: doc.ownerId,
      groupId: doc.groupId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  toResDTO(level: number): IActionDerived {
    return {
      ...this.props,
      level: level,
    }
  }
}
