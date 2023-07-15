import { InternalServerErrorException } from '@nestjs/common'

export class InternalServerError extends InternalServerErrorException {
  constructor(message: string) {
    super(message)
  }
}
