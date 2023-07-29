import { BadRequestError } from '../400/index.error'

/** Thrown when certain action cannot be done if you are not signed in (proves valid credentials)
 * @example
 * throw new UnidentifiedUserError(`Google`)
 */
export class UnidentifiedUserError extends BadRequestError {
  constructor() {
    // i.e) Something went wrong while we are signing you in with the following method: Google
    super(`You are not able to perform as you are not signed in`)
  }
}
