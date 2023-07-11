import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionForbiddenError } from './forbidden.error'

/** Thrown when certain data is missing when it is supposed to be present.\
 * @param
 * atd: AccessTokenDomain
 * actionName: string. Follow CamelCase with space. i.e) `Read Word`, `Read User`
 *
 * @example
 * throw new ReadForbiddenError(atd, `Word`) // When singular
 */

export class ReadForbiddenError extends ActionForbiddenError {
  constructor(atd: AccessTokenDomain, resourceName: string) {
    // i.e) User "abc" is not authorized to perform the following action: "Read Word"
    super(atd, resourceName, 'Read')
  }
}
