import { InternalServerErrorException } from '@nestjs/common'

// TODO: Anything that is not standardized should be thrown with this exception.
export class InternalServerError extends InternalServerErrorException {
  constructor(message: string) {
    super(message)
  }
}
