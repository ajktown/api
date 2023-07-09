import { BadRequestException, UnauthorizedException } from '@nestjs/common'

/** Thrown when certain data is missing when it is supposed to be present.
 * @example
 * throw new UnauthorizedSignInError(`Google`)
 */

export class UnauthorizedSignInError extends BadRequestException {
  constructor(singInMethod: string) {
    // i.e) Something went wrong while we are signing you in with the following method: Google
    super(
      `Something went wrong while we are signing you in with the following method: ${singInMethod}`,
    )
  }
}

// TODO: Anything that is not standardized should be thrown with this exception.
export class UnauthorizedError extends UnauthorizedException {
  constructor(message: string) {
    super(message)
  }
}
