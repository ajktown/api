import { UserDomain } from '../user/user.domain'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { Request } from 'express'
import { CookieConst } from '@/constants/cookie.const'
import { envLambda } from '@/lambdas/get-env.lambda'
import { DataNotPresentError } from '@/errors/400/bad-request.error'

export interface IOauthPayload {
  userEmail: string
  userId: string
  profileImageUrl: string
}

export class AccessTokenDomain {
  private readonly props: Partial<IOauthPayload>

  private constructor(props: IOauthPayload) {
    if (!props.userEmail) throw new DataNotPresentError(`User email`)
    if (!props.userId) throw new DataNotPresentError(`User ID`)
    this.props = props
  }

  get email() {
    return this.props.userEmail
  }

  get userId() {
    return this.props.userId
  }

  get profileImageUrl() {
    return this.props.profileImageUrl
  }

  static fromUser(user: UserDomain) {
    const userRes = user.toResDTO()
    return new AccessTokenDomain({
      userEmail: userRes.email,
      userId: userRes.id,
      profileImageUrl: userRes.imageUrl,
    })
  }

  static async fromReq(
    req: Request,
    jwtService: JwtService,
  ): Promise<AccessTokenDomain> {
    // allow postman under dev
    if (envLambda.mode.isLocal() && req.headers['postman-token'])
      return AccessTokenDomain.fromUser(UserDomain.underDevEnv())

    if (!req.cookies)
      throw new DataNotPresentError(`Http-only cookies`, { isPlural: true })

    const potentialToken = req.cookies[CookieConst.AjktownSecuredAccessToken]
    if (typeof potentialToken !== 'string')
      throw new DataNotPresentError(`AJK Town Secured Access Token`)
    const attr = await jwtService.verify(potentialToken)
    return new AccessTokenDomain(attr)
  }

  toDetailedInfo(): IOauthPayload {
    return {
      userEmail: this.props.userEmail,
      userId: this.props.userId,
      profileImageUrl: this.props.profileImageUrl,
    }
  }

  async toAccessToken(jwtService: JwtService): Promise<PostOauthRes> {
    return {
      accessToken: await jwtService.signAsync(this.toDetailedInfo()),
    }
  }
}
