import { BadRequestException } from '@nestjs/common'

/**
 * @class BadRequestError
 * @description
 * Thrown when certain data is missing when it is supposed to be present.
 * @example
 * throw new BadRequestError(`User email is not present`)
 */
export class BadRequestError extends BadRequestException {
  constructor(message: string) {
    super(message)
  }
}
