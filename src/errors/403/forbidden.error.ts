import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ForbiddenException } from '@nestjs/common'

const PRIVATE_NOT_AUTHORIZED_TO_PERFORM = `is not authorized to perform the following action`

/** Thrown when certain data is missing when it is supposed to be present.\
 * @param
 * atd: AccessTokenDomain
 * actionName: string. Follow CamelCase with space. i.e) `Update Word`, `Update User`
 *
 * @example
 * throw new UpdateForbiddenError(atd, `Word`) // When singular
 */
export class UpdateForbiddenError extends ForbiddenException {
  constructor(atd: AccessTokenDomain, resourceName: string) {
    // i.e) User "abc" is not authorized to perform the following action: "Update Word"
    super(
      `User "${atd.userId}" ${PRIVATE_NOT_AUTHORIZED_TO_PERFORM}: Update ${resourceName}`,
    )
  }
}

/** Thrown when certain data is missing when it is supposed to be present.\
 * @param
 * atd: AccessTokenDomain
 * actionName: string. Follow CamelCase with space. i.e) `Update Word`, `Update User`
 *
 * @example
 * throw new DeleteForbiddenError(atd, `Word`) // When singular
 */

export class DeleteForbiddenError extends ForbiddenException {
  constructor(atd: AccessTokenDomain, resourceName: string) {
    // i.e) User "abc" is not authorized to perform the following action: "Delet  Word"
    super(
      `User "${atd.userId}" ${PRIVATE_NOT_AUTHORIZED_TO_PERFORM}: Delete ${resourceName}`,
    )
  }
}

/** Not categorized error */
export class ForbiddenError extends ForbiddenException {
  constructor(message: string) {
    super(message)
  }
}
