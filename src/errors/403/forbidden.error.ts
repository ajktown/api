import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ForbiddenException } from '@nestjs/common'

/** Thrown when certain data is missing when it is supposed to be present.\
 * @param
 * atd: AccessTokenDomain
 * actionName: string. Follow CamelCase with space. i.e) `Update Word`, `Delete Word`
 *
 * @example
 * throw new ForbiddenError(atd, `Update Word`) // When singular
 */

export class ForbiddenError extends ForbiddenException {
  constructor(atd: AccessTokenDomain, actionName: string) {
    // i.e) User "abc" is not authorized to perform the following action: "Update Word"
    super(
      `User "${atd.userId}" is not authorized to perform the following action: ${actionName}`,
    )
  }
}
