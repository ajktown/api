import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { ForbiddenException } from '@nestjs/common'

/** Not categorized error */
export class ForbiddenError extends ForbiddenException {
  constructor(message: string) {
    super(message)
  }
}

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
