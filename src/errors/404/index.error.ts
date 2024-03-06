import { NotFoundException } from '@nestjs/common'

export class NotFoundError extends NotFoundException {
  constructor(message: string) {
    super(message)
  }
}
