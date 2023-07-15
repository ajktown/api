import { BadRequestError } from '../400/index.error'

/** Thrown when certain data is missing when it is supposed to be present.
 * @example
 * throw new UnauthorizedSignInError(`Google`)
 */
export class UnauthorizedSignInError extends BadRequestError {
  constructor(singInMethod: string) {
    // i.e) Something went wrong while we are signing you in with the following method: Google
    super(
      `Something went wrong while we are signing you in with the following method: ${singInMethod}`,
    )
  }
}
