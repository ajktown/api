import { BadRequestError } from './index.error'

/** Thrown when certain data is missing when it is supposed to be present.
 * @example
 * throw new DataNotPresentError(`User email`) // When singular
 * throw new DataNotPresentError(`Users`, true) // When plural
 */
interface PrivateOptional {
  isPlural?: boolean
}
export class DataNotPresentError extends BadRequestError {
  constructor(dataType: string, optional?: PrivateOptional) {
    const messageSuffix = optional.isPlural
      ? 'are not present'
      : 'is not present'
    super(`${dataType} ${messageSuffix}`) // i.e) User email is not present
  }
}
