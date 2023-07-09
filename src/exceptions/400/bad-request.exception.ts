import { BadRequestException } from '@nestjs/common'

/** Thrown when certain data is missing when it is supposed to be present. */
export class DataNotPresentException extends BadRequestException {
  constructor(dataType: string) {
    super(`${dataType} is not present`)
  }
}

/** Thrown when certain plural data are missing when they are supposed to be present. */
export class PluralDataNotPresentException extends BadRequestException {
  constructor(dataType: string) {
    super(`${dataType} are not present`)
  }
}
