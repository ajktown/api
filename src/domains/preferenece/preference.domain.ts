import { AccessTokenDomain } from '../auth/access-token.domain'
import { IPreference } from './index.interface'

export class PreferenceDomain {
  private readonly props: Partial<IPreference>

  private constructor(atd: AccessTokenDomain, props: Partial<IPreference>) {
    this.props = props
  }

  toResDTO(): Partial<IPreference> {
    return this.props
  }
}
