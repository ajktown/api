import { UserDomain } from '../user/user.domain'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'

interface IOauthPayload {
  userEmail: string
}

export class AccessTokenDomain {
  private readonly props: Partial<IOauthPayload>

  private constructor(props: Partial<IOauthPayload>) {
    this.props = props
  }

  get email() {
    return this.props.userEmail
  }

  static fromUser(user: UserDomain) {
    return new AccessTokenDomain({
      userEmail: user.toResDTO().email,
    })
  }

  async toAccessToken(jwtService: JwtService): Promise<PostOauthRes> {
    return {
      accessToken: await jwtService.signAsync({
        userEmail: this.props.userEmail,
      }),
    }
  }
}
