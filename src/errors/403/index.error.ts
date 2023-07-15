import { ForbiddenException } from '@nestjs/common'

/** Not categorized error */
export class ForbiddenError extends ForbiddenException {
  constructor(message: string) {
    super(message)
  }
}
