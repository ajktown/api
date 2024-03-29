import { UserDomain } from '@/domains/user/user.domain'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { Injectable, Logger } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { JwtService } from '@nestjs/jwt'
import { OauthPayloadDomain } from '@/domains/auth/oauth-payload.domain'
import { UserProps, UserModel } from '@/schemas/deprecated-user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { Request } from 'express'
import { AuthPrepDomain } from '@/domains/auth/auth-prep.domain'
import { UnauthorizedSignInError } from '@/errors/401/unauthorized-sign-in.error'

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    @InjectModel(UserProps.name)
    private userModel: UserModel,
  ) {}

  /** Validate and generate AccessTokenDomain based on the temporary token Google has generated */
  async byGoogle(
    query: PostAuthGoogleBodyDTO,
    req: Request,
  ): Promise<AccessTokenDomain> {
    try {
      const ticket = await new OAuth2Client(query.clientId).verifyIdToken({
        idToken: query.credential,
        audience: query.clientId,
      })

      const oauthPayload = OauthPayloadDomain.fromGooglePayload(
        ticket.getPayload(),
      )

      return AccessTokenDomain.fromUser(
        await UserDomain.fromOauthPayload(oauthPayload, this.userModel),
        req,
      )
    } catch (err) {
      this.logger.error(err)
      throw new UnauthorizedSignInError(`Google`)
    }
  }

  /** Only usable when user is already signed in */
  async byRequest(req: Request): Promise<AccessTokenDomain> {
    return AccessTokenDomain.fromReq(req, this.jwtService)
  }

  /** Attaches HttpOnly Token for dev-user */
  async byDevToken(req: Request): Promise<AccessTokenDomain> {
    return AccessTokenDomain.fromUser(UserDomain.underDevEnv(), req)
  }

  /** Returns AuthPrepDomain that contains sign in information of any requester. */
  async getAuthPrep(req: Request): Promise<AuthPrepDomain> {
    try {
      return AuthPrepDomain.fromAtd(
        await AccessTokenDomain.fromReq(req, this.jwtService),
      )
    } catch {
      return AuthPrepDomain.fromFailedSignIn()
    }
  }
}
