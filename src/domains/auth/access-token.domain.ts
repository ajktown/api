import { UserDomain } from '../user/user.domain'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { Request } from 'express'
import { CookieConst } from '@/constants/cookie.const'

export interface IOauthPayload {
  userEmail: string
  userId: string
}

export class AccessTokenDomain {
  private readonly props: Partial<IOauthPayload>

  private constructor(props: IOauthPayload) {
    if (props.userEmail === undefined) throw new Error('user email not defined')
    if (props.userId === undefined) throw new Error('user id not defined')
    this.props = props
  }

  get email() {
    return this.props.userEmail
  }

  get userId() {
    return this.props.userId
  }

  static fromUser(user: UserDomain) {
    return new AccessTokenDomain({
      userEmail: user.toResDTO().email,
      userId: user.toResDTO().id,
    })
  }

  static async fromReq(
    req: Request,
    jwtService: JwtService,
  ): Promise<AccessTokenDomain> {
    if (!req.cookies) throw new Error("Http-only cookie doesn't exist")

    const potentialToken = req.cookies[CookieConst.AjktownSecuredAccessToken]
    if (typeof potentialToken !== 'string')
      throw new Error("SAT Token cookie doesn't exist")
    const attr = await jwtService.verify(potentialToken)
    return new AccessTokenDomain(attr)
  }

  toDetailedInfo(): IOauthPayload {
    return {
      userEmail: this.props.userEmail,
      userId: this.props.userId,
    }
  }

  async toAccessToken(jwtService: JwtService): Promise<PostOauthRes> {
    return {
      accessToken: await jwtService.signAsync(this.toDetailedInfo()),
    }
  }
}
