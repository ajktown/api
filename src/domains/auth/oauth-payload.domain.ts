import { TokenPayload } from 'google-auth-library'

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

  static fromPayload(payload: TokenPayload) {
    if (!payload.email) throw new Error('Failed to find email')
    return new OauthPayloadDomain({
      userEmail: payload.email,
    })
  }
}
