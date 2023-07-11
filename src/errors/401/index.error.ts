import { UnauthorizedException } from '@nestjs/common'

/**
 * @class UnauthorizedError
 * @description
 * Thrown when a user is not authorized to perform an action.
 * @example
 * throw new UnauthorizedError(`You are not authorized to perform this action`)
 */
export class UnauthorizedError extends UnauthorizedException {
  constructor(message: string) {
    super(message)
  }
}
