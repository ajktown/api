import { BadRequestError } from './index.error'

export class NumberNotInRangeError extends BadRequestError {
  constructor(value: string, got: number, from: number, until: number) {
    super(
      `Value "${value}" must be in the expected range: ${from}~${until}; got: ${got}`,
    )
  }
}
