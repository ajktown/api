import { UserDomain } from '../user/user.domain'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { Request } from 'express'
import { CookieConst } from '@/constants/cookie.const'
import { envLambda } from '@/lambdas/get-env.lambda'
import { DataNotPresentError } from '@/errors/400/data-not-present.error'
import { getTimezone } from '@/lambdas/get-timezone.lambda'

export interface IOauthPayloadNonDb {
  timezone: string
  isFirstTimeUser: boolean
}
export interface IOauthPayload {
  userEmail: string
  userId: string
  profileImageUrl: string
  createdAt: string
}

export class AccessTokenDomain {
  private readonly props: Partial<IOauthPayload>
  readonly timezone: string

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

  get isFirstTimeUser(): boolean {
    if (!this.props.createdAt) return false // it is considered not a first time user, if createdAt is not present
    return new Date().valueOf() < new Date(this.props.createdAt).valueOf() + 20
  }

  static fromUser(user: UserDomain, req?: Request) {
    const userRes = user.toResDTO()
    return new AccessTokenDomain(
      {
        userEmail: userRes.email,
        userId: userRes.id,
        profileImageUrl: userRes.imageUrl,
        createdAt: userRes.createdAt?.toISOString(),
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

  toDetailedInfo(): IOauthPayload & IOauthPayloadNonDb {
    return {
      userEmail: this.props.userEmail,
      createdAt: this.props.createdAt,
      userId: this.props.userId,
      profileImageUrl: this.props.profileImageUrl,
      timezone: this.timezone,
      // The user is considered the first time user, if the user has signed up within 10 seconds.
      isFirstTimeUser: this.isFirstTimeUser,
    }
  }

  async toAccessToken(jwtService: JwtService): Promise<PostOauthRes> {
    return {
      accessToken: await jwtService.signAsync(this.toDetailedInfo()),
    }
  }
}
