import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ActionForbiddenError } from './forbidden.error'

/** Thrown when certain data is missing when it is supposed to be present.\
 * @param
 * atd: AccessTokenDomain
 * actionName: string. Follow CamelCase with space. i.e) `Update Word`, `Update User`
 *
 * @example
 * throw new DeleteForbiddenError(atd, `Word`) // When singular
 */

export class DeleteForbiddenError extends ActionForbiddenError {
  constructor(atd: AccessTokenDomain, resourceName: string) {
    // i.e) User "abc" is not authorized to perform the following action: "Delet  Word"
    super(atd, resourceName, 'Delete')
  }
}
