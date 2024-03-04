import { BadRequestError } from '../../400/index.error'

/** Thrown when a certain resource is not found or the user does not have permission to access it.
 * This is used, especially when you want to hide its existence from the user.
 * @example
 * throw new NotExistOrNoPermissionError()
 */
export class NotExistOrNoPermissionError extends BadRequestError {
  constructor() {
    super(
      `The resource does not exist or you do not have permission to access it`,
    )
  }
}
