import { UserDomain } from '@/domains/user/user.domain'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { JwtService } from '@nestjs/jwt'
import { OauthPayloadDomain } from '@/domains/auth/oauth-payload.domain'
import {
  DeprecatedUserSchemaProps,
  UserModel,
} from '@/schemas/deprecated-user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { Request } from 'express'
import { AuthPrepDomain } from '@/domains/auth/auth-prep.domain'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(DeprecatedUserSchemaProps.name)
    private userModel: UserModel,
  ) {}

  /** Get words by given query */
  async byGoogle(query: PostAuthGoogleBodyDTO): Promise<AccessTokenDomain> {
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
      )
    } catch (error) {
      throw new Error('Invalid Credential')
    }
  }

  /** Attaches HttpOnly Token for dev-user */
  async byDevToken(): Promise<AccessTokenDomain> {
    return AccessTokenDomain.fromUser(UserDomain.underDevEnv())
  }

  /** Returns the basic data of the currently signed user, if signed in.
   * It is important that at this point, this getAuthPrep does NOT depend on the connection
   * to the database.
   */
  async getAuthPrep(req: Request): Promise<AuthPrepDomain> {
    try {
      const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
      return AuthPrepDomain.fromAtd(atd)
    } catch {
      return AuthPrepDomain.fromFailedSignIn()
    }
  }
}
