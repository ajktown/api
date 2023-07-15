import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ForbiddenError } from '../index.error'

export class ActionForbiddenError extends ForbiddenError {
  constructor(
    atd: AccessTokenDomain,
    resourceName: string,
    actionName: string,
  ) {
    // i.e) User "abc" is not authorized to perform the following action: "Read Word"
    super(
      `User "${atd.userId}" is not authorized to perform the following action: ${actionName} ${resourceName}`,
    )
  }
}
