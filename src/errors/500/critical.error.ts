import { InternalServerError } from './index.error'

/** Thrown when things should never happen.
 */
interface PrivateOptional {
  isPlural?: boolean
}
export class CriticalError extends InternalServerError {
  constructor(reasonWhyCritical: string) {
    super(`CRITICAL_ERROR: ${reasonWhyCritical}`) // i.e) User email is not present
  }
}
