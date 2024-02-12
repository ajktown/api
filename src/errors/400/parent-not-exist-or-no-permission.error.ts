import { BadRequestError } from './index.error'

/** Thrown when a certain resource is not found or the user does not have permission to access it.
 * This error is used when target resource's parent does not exist or the user does not have permission to access it.
 */
export class ParentNotExistOrNoPermissionError extends BadRequestError {
  constructor(parentResourceName: string, id: string) {
    super(
      `The parent resource "${parentResourceName}" with id "${id}" does not exist or you do not have permission to access it`,
    )
  }
}
