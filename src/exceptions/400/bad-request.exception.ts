import { BadRequestException } from '@nestjs/common'

/** Thrown when certain data is missing when it is supposed to be present.
 * @example
 * throw new DataNotPresentException(`User email`) // When singular
 * throw new DataNotPresentException(`Users`, true) // When plural
 */

type PrivateOptional = {
  isPlural?: boolean
}
export class DataNotPresentException extends BadRequestException {
  constructor(dataType: string, optional?: PrivateOptional) {
    const messageSuffix = optional.isPlural
      ? 'are not present'
      : 'is not present'
    super(`${dataType} ${messageSuffix}`) // i.e) User email is not present
  }
}

// TODO: Anything that is not standardized should be thrown with this exception.
export class NotStandardizedBadRequestException extends BadRequestException {
  constructor(message: string) {
    super(message)
  }
}
