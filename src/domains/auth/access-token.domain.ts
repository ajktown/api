import { UserDomain } from '../user/user.domain'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { Request } from 'express'
import { CookieConst } from '@/constants/cookie.const'
import { envLambda } from '@/lambdas/get-env.lambda'
import { DataNotPresentError } from '@/errors/400/data-not-present.error'
import { getTimezone } from '@/lambdas/get-timezone.lambda'

export interface IOauthPayload {
  userEmail: string
  userId: string
  profileImageUrl: string
}

export class AccessTokenDomain {
  private readonly props: Partial<IOauthPayload>
  private readonly timezone: string

  private constructor(props: IOauthPayload, timezone: string) {
    if (!props.userEmail) throw new DataNotPresentError(`User email`)
    if (!props.userId) throw new DataNotPresentError(`User ID`)
    this.props = props
    this.timezone = timezone
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

  static fromUser(user: UserDomain, req: Request) {
    const userRes = user.toResDTO()
    return new AccessTokenDomain(
      {
        userEmail: userRes.email,
        userId: userRes.id,
        profileImageUrl: userRes.imageUrl,
      },
      getTimezone(req),
    )
  }

  /** Returns Atd if header of request has valid atd attached.
   * Throws error if not valid.
   */
  static async fromReq(
    req: Request,
    jwtService: JwtService,
  ): Promise<AccessTokenDomain> {
    // allow postman under dev
    if (envLambda.mode.isLocal() && req.headers['postman-token'])
      return AccessTokenDomain.fromUser(UserDomain.underDevEnv(), req)

    if (!req.cookies)
      throw new DataNotPresentError(`Http-only cookies`, { isPlural: true })

    const potentialToken = req.cookies[CookieConst.AjktownSecuredAccessToken]
    if (typeof potentialToken !== 'string')
      throw new DataNotPresentError(`AJK Town Secured Access Token`)
    const attr = await jwtService.verify(potentialToken)
    return new AccessTokenDomain(attr, getTimezone(req))
  }

  toDetailedInfo(): IOauthPayload & { timezone: string } {
    return {
      userEmail: this.props.userEmail,
      userId: this.props.userId,
      profileImageUrl: this.props.profileImageUrl,
      timezone: this.timezone,
    }
  }

  async toAccessToken(jwtService: JwtService): Promise<PostOauthRes> {
    return {
      accessToken: await jwtService.signAsync(this.toDetailedInfo()),
    }
  }
}
