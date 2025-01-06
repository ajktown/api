import { BadRequestError } from './index.error'

/** Thrown when certain data is not acceptable
 * @example
 * throw new DataNotSelectableError('which', ['today', 'yesterday'])
 * => Invalid key [which]: Only acceptable in [today, yesterday]
 */
export class DataNotSelectableError extends BadRequestError {
  constructor(key: string, acceptable: string[]) {
    super(`Invalid key [${key}]: Only acceptable in [${acceptable.toString()}]`) // i.e) User email is not present
  }
}
