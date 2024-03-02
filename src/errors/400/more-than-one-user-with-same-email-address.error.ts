import { BadRequestError } from './index.error'

/**
 * Thrown when two or more users fatally have the same email addresses.
 * This is not acceptable in AJK Town's user system.
 */
export class MoreThanOneUserWithTheSameEmailAddressError extends BadRequestError {
  constructor() {
    super('Two or more users fatally have the same email addresses')
  }
}
