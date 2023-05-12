import { DeprecatedUserDocument } from '@/schemas/deprecated-user.schema'
import { TokenPayload } from 'google-auth-library'
import { FilterQuery } from 'mongoose'

interface IOauthPayload {
  userEmail: string
}

export class OauthPayloadDomain {
  private readonly props: Partial<IOauthPayload>

  private constructor(props: Partial<IOauthPayload>) {
    this.props = props
  }

  get email() {
    return this.props.userEmail
  }

  static fromGooglePayload(payload: TokenPayload) {
    if (!payload.email) throw new Error('Failed to find email')
    return new OauthPayloadDomain({
      userEmail: payload.email,
    })
  }

  toFind(): FilterQuery<Partial<DeprecatedUserDocument>> {
    return {
      email: this.email,
    }
  }
}
