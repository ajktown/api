import { BadRequestError } from './index.error'

export class DataNotObjectError extends BadRequestError {
  constructor() {
    super(`Given data is not JavaScript object type`) // i.e) User email is not present
  }
}
